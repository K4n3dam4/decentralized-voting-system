import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ElectionCreateDto, ElectionRegisterDto } from './election.dto';
import { AdminDto, PrismaService } from '@dvs/prisma';
import { EthersSigner, InjectSignerProvider } from 'nestjs-ethers';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ContractFactory } from 'ethers';
import { Election__factory } from '@dvs/smart-contracts';

@Injectable()
export class ElectionService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    @InjectSignerProvider()
    private readonly signer: EthersSigner,
  ) {}

  async getElection(electionId: string) {
    const id = Number(electionId);
    const election = await this.prisma.election.findUnique({ where: { id } });
    if (!election) throw new NotFoundException('election.notFound');
    return this.sanitizeElections(election);
  }

  async getAllElections() {
    const elections = await this.prisma.election.findMany();
    if (!elections) throw new NotFoundException('election.notFound');
    return this.sanitizeElections(elections);
  }

  async createElection(bearer: string, dto: ElectionCreateDto) {
    // get serviceNumber
    const { serviceNumber } = this.decodeBearer(bearer) as Partial<AdminDto>;
    // get admin
    const admin = await this.prisma.admin.findUnique({ where: { serviceNumber } });
    if (!admin) throw new ForbiddenException('signin.forbidden.wrongServiceNumber');

    const signer = this.signer.createWallet(this.config.get('adminPk'));
    // const factory = new ContractFactory(Election__factory.abi, Election__factory.bytecode, signer);
    // const contract = await factory.deploy(dto.name, dto.eligibleVoters, dto.expires);

    // add election to db
    const election = await this.prisma.election.create({
      data: {
        name: dto.name,
        candidates: dto.candidates,
        contract: '',
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
    const id = Number(electionId);
    const election = await this.prisma.election.findUnique({ where: { id } });
    if (!election) throw new NotFoundException('election.notFound');
    if (!election.eligibleVoters.includes(ssn)) throw new ForbiddenException('election.voter.uneligible');

    const voterWallet = this.signer.createRandomWallet();
    const updatedEligibleVoters = election.eligibleVoters.map((eligibleSSN) => {
      if (eligibleSSN === ssn) return voterWallet.address;
      else return eligibleSSN;
    });

    try {
      await this.prisma.election.update({
        data: {
          eligibleVoters: {
            set: updatedEligibleVoters,
          },
        },
        where: { id },
      });

      return {
        mnemonic: voterWallet.mnemonic.phrase,
        election: this.sanitizeElections(election),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(error, 500);
      }
    }
  }

  sanitizeElections(elections: any) {
    if (!elections.length) {
      const { name, candidates, expires } = elections;
      return { name, candidates, expires };
    } else {
      return elections.map(({ name, candidates, expires }) => ({ name, candidates, expires }));
    }
  }

  decodeBearer(bearer: string) {
    const token = bearer.split(' ')[1];
    return this.jwt.decode(token);
  }
}
