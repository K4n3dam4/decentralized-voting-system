import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ElectionCreateDto,
  ElectionEligibleDto,
  ElectionEligibleUpdateDto,
  ElectionRegisterDto,
  ElectionVoteDto,
} from './election.dto';
import { PrismaService } from '@dvs/prisma';
import { EthersContract, EthersSigner, InjectContractProvider, InjectSignerProvider } from 'nestjs-ethers';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ContractFactory } from 'ethers';
import { Election__factory } from '@dvs/smart-contracts';
import { ElectionEntity } from './election.entity';
import * as argon from 'argon2';

@Injectable()
export class ElectionService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    @InjectContractProvider()
    private readonly contract: EthersContract,
    @InjectSignerProvider()
    private readonly signer: EthersSigner,
  ) {}

  async getElection(userId: number, electionId: string) {
    const id = Number(electionId);
    const election = await this.prisma.election.findUnique({
      where: { id },
      include: { registeredVoters: { where: { userId } } },
    });

    if (!election) throw new NotFoundException('error.api.election.notFound');

    return new ElectionEntity({
      ...election,
      registered: election.registeredVoters.length === 1,
    });
  }

  async getAllElections() {
    const elections = await this.prisma.election.findMany();
    if (!elections) throw new NotFoundException('error.api.election.notFound');
    return elections.map((election) => new ElectionEntity({ ...election }));
  }

  async createElection(dto: ElectionCreateDto, id: number) {
    // get admin
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin) throw new ForbiddenException('error.api.election.wrongServiceNumber');

    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const factory = new ContractFactory(Election__factory.abi, Election__factory.bytecode, signer);

    try {
      // deploy contract
      const contract = await factory.deploy(
        dto.name,
        dto.candidates.map(({ name }) => name),
        dto.expires,
      );
      // add election to db
      const election = await this.prisma.election.create({
        data: {
          name: dto.name,
          image: dto.image,
          description: dto.description,
          candidates: dto.candidates as unknown as Prisma.JsonArray,
          contract: contract.address,
          expires: new Date(dto.expires * 1000),
          eligibleVoters: {
            create: dto.eligibleVoters.map((ssn) => ({ ssn })),
          },
          admin: {
            connect: {
              id: admin.id,
            },
          },
        },
      });

      return { ...election };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('db.error', 500);
      } else {
        const { reason } = error.error.error.data;
        throw new HttpException(reason, 403);
      }
    }
  }

  async updateEligibleVoter(dto: ElectionEligibleUpdateDto, eligibleId: string) {
    const eligibleVoter = await this.prisma.eligibleVoter.update({
      where: { id: Number(eligibleId) },
      data: { ssn: dto.ssn ?? null, wallet: dto.wallet ?? null },
    });
    if (!eligibleVoter) throw new NotFoundException('error.api.eligibleVoter.notFound');

    return { ...eligibleVoter };
  }

  async registerVoter(dto: ElectionRegisterDto, userId: number, electionId: string) {
    const { ssn } = dto;
    // get user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    // verify ssn
    const matchHash = await argon.verify(user.ssn, ssn);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('error.api.election.wrongSSN');

    // get election with eligible voter relation equal to voter ssn
    const election = await this.prisma.election.findFirst({
      where: { id: Number(electionId) },
      include: { eligibleVoters: { where: { ssn }, select: { id: true, ssn: true } } },
    });

    // exception voter is not eligible
    if (election.eligibleVoters.length !== 1) {
      throw new ForbiddenException('error.api.election.uneligible');
    }

    try {
      // create voter wallet for the specified election
      const voterWallet = this.signer.createRandomWallet();
      // get signer and contract instance
      const signer = this.signer.createWallet(this.config.get('adminPk'));
      const contract = this.contract.create(election.contract, Election__factory.abi, signer);
      // estimate current gas
      const { gasPrice, lastBaseFeePerGas } = await contract.provider.getFeeData();
      const fee = gasPrice.mul(lastBaseFeePerGas).mul(2);

      // register voter
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
        throw new HttpException('db.error', 500);
      } else {
        const { reason } = error.error.error.data;
        throw new HttpException(reason, 403);
      }
    }
  }

  async eligibleVoter({ mnemonic }: ElectionEligibleDto, electionId: string) {
    const signer = this.signer.createWalletfromMnemonic(mnemonic);
    const eligibleVoter = await this.prisma.eligibleVoter.findFirst({
      where: { electionId: Number(electionId), wallet: signer.address },
    });

    // exception voter is not registered
    if (!eligibleVoter) {
      throw new ForbiddenException('error.api.election.uneligible');
    }

    return signer;
  }

  async vote({ mnemonic, candidate }: ElectionVoteDto, userId: number, electionId: string) {
    // get election
    const election = await this.prisma.election.findUnique({
      where: { id: Number(electionId) },
      include: {
        registeredVoters: { where: { userId, electionId: Number(electionId) } },
      },
    });
    // create contract instance
    const signer = this.signer.createWalletfromMnemonic(mnemonic);
    const contract = this.contract.create(election.contract, Election__factory.abi, signer);

    try {
      // vote
      await contract.functions.vote(candidate);
      // update registered Voter
      await this.prisma.registeredVoter.update({
        data: { hasVoted: true },
        where: { id: election.registeredVoters[0].id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('db.error', 500);
      } else {
        const { reason } = error.error.error.data;
        throw new HttpException(reason, 403);
      }
    }
  }
}
