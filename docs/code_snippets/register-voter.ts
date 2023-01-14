import { ElectionRegisterDto } from "../../libs/api/src";
import * as argon from "argon2";
import { ForbiddenException, HttpException } from "@nestjs/common";
import { Election__factory } from "../../libs/smart-contracts/src";

async registerVoter(dto: ElectionRegisterDto, userId: number, electionId: string) {
  const { ssn } = dto;
  // get user
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  // verify ssn
  const matchHash = await argon.verify(user.ssn, ssn);
  // mismatched hash
  if (!matchHash) throw new ForbiddenException({ message: 'error.api.election.wrongSSN' });

  // get election with eligible voter relation equal to voter ssn
  const election = await this.prisma.election.findFirst({
    where: { id: Number(electionId) },
    include: { eligibleVoters: { where: { ssn }, select: { id: true, ssn: true } } },
  });

  // exception voter is not eligible
  if (election.eligibleVoters.length !== 1) {
    throw new ForbiddenException({ message: 'error.api.election.ineligible' });
  }

  try {
    // create voter wallet for the specified election
    const voterWallet = this.signer.createRandomWallet();
    // get signer and contract instance
    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const contract = this.contract.create(election.contract, Election__factory.abi, signer);
    // calc fee
    const gasPrice = await signer.getGasPrice();
    const gasLimit = await contract.estimateGas.vote(0);
    const fee = gasPrice.mul(gasLimit).mul(5);

    // // register voter
    await contract.functions.registerVoter(voterWallet.address, { value: fee });
    // add voting weight
    await contract.functions.addVotingWeight(voterWallet.address);
    // create voter relation to election
    await this.prisma.registeredVoter.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        election: {
          connect: {
            id: Number(electionId),
          },
        },
      },
    });

    await this.prisma.eligibleVoter.update({
      where: { id: election.eligibleVoters[0].id },
      data: { ssn: null, wallet: voterWallet.address },
    });

    return {
      mnemonic: voterWallet.mnemonic.phrase,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    } else {
      if (error?.error?.error?.data?.reason) {
        throw new HttpException({ message: error.error.error.data.reason }, 403);
      } else if (error?.error?.reason) {
        const code = error.error.reason.split(': ')[1];
        throw new HttpException({ message: code }, 403);
      } else {
        throw new HttpException({ message: 'error.contract.unknown' }, 500);
      }
    }
  }
}