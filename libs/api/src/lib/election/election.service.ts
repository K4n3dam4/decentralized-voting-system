import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ElectionCreateDto, ElectionRegisterDto, ElectionVoteDto } from './election.dto';
import { PrismaService } from '@dvs/prisma';
import { EthersContract, EthersSigner, InjectContractProvider, InjectSignerProvider } from 'nestjs-ethers';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Election } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ContractFactory, ethers } from 'ethers';
import { Election__factory } from '@dvs/smart-contracts';

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

  async getElection(electionId: string) {
    const election = await this.getElectionInternal(electionId);
    return this.sanitizeElections(election);
  }

  async getAllElections() {
    const elections = await this.prisma.election.findMany();
    if (!elections) throw new NotFoundException('election.notFound');
    return this.sanitizeElections(elections);
  }

  async createElection(dto: ElectionCreateDto, id: number) {
    // get admin
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin) throw new ForbiddenException('signin.forbidden.wrongServiceNumber');

    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const factory = new ContractFactory(Election__factory.abi, Election__factory.bytecode, signer);
    const contract = await factory.deploy(dto.name, dto.eligibleVoters, dto.expires);

    // add election to db
    const election = await this.prisma.election.create({
      data: {
        name: dto.name,
        image: dto.image,
        description: dto.description,
        candidates: dto.candidates as unknown as Prisma.JsonArray,
        contract: contract.address,
        eligibleVoters: dto.eligibleVoters,
        expires: new Date(dto.expires * 1000),
        admin: {
          connect: {
            id: admin.id,
          },
        },
      },
    });

    return { ...election };
  }

  async registerVoter(dto: ElectionRegisterDto, electionId: string) {
    const { ssn } = dto;
    const election = await this.getElectionInternal(electionId);
    if (!election.eligibleVoters.includes(ssn)) throw new ForbiddenException('election.voter.uneligible');

    // create voter wallet for the specified election
    const voterWallet = this.signer.createRandomWallet();
    // replace voter ssn with voter wallet address in eligible voters election entry
    const updatedEligibleVoters = election.eligibleVoters.map((eligibleSSN) => {
      if (eligibleSSN === ssn) return voterWallet.address;
      else return eligibleSSN;
    });
    // prepare voter for election
    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const contract = this.contract.create(election.contract, Election__factory.abi, signer);
    // register voter
    await contract.functions.registerVoter(voterWallet.address, { value: ethers.utils.parseEther('0.8') });
    // add voting weight
    await contract.functions.addVotingWeight(voterWallet.address);

    try {
      await this.prisma.election.update({
        data: {
          eligibleVoters: {
            set: updatedEligibleVoters,
          },
        },
        where: { id: election.id },
      });

      return {
        mnemonic: voterWallet.mnemonic.phrase,
        election: this.sanitizeElections(election),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('db.error', 500);
      }
    }
  }

  async vote({ mnemonic, candidate }: ElectionVoteDto, electionId: string) {
    const election = await this.getElectionInternal(electionId);
    const signer = this.signer.createWalletfromMnemonic(mnemonic);

    const voterIsRegisteredInDb = election.eligibleVoters.indexOf(signer.address);
    // exception voter is not registered
    if (voterIsRegisteredInDb < 0) {
      throw new ForbiddenException('election.voter.unregistered');
    }
    // update eligible voters
    const updatedEligibleVoters = [...election.eligibleVoters];
    updatedEligibleVoters.splice(voterIsRegisteredInDb, 1);

    const contract = this.contract.create(election.contract, Election__factory.abi, signer);

    try {
      await contract.functions.vote(candidate);
      await this.prisma.election.update({
        data: {
          eligibleVoters: {
            set: updatedEligibleVoters,
          },
        },
        where: { id: election.id },
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

  async getElectionInternal(electionId: string) {
    const id = Number(electionId);
    const election: Election = await this.prisma.election.findUnique({ where: { id } });
    if (!election) throw new NotFoundException('election.notFound');
    return election;
  }

  sanitizeElections(elections: Election | Election[]): Partial<Election> | Partial<Election>[] {
    if (!Array.isArray(elections)) {
      delete elections.eligibleVoters;
      delete elections.adminId;
      return elections;
    } else {
      return elections.map((election) => {
        delete election.eligibleVoters;
        delete election.adminId;
        return election;
      });
    }
  }
}
