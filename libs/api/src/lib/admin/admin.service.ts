import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ContractFactory,
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectSignerProvider,
} from 'nestjs-ethers';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@dvs/prisma';
import { Election__factory } from '@dvs/smart-contracts';
import {
  ElectionCreateDto,
  ElectionUpdateDto,
  EligibleCreateDto,
  EligibleDeleteDto,
  EligibleUpdateDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    @InjectSignerProvider()
    private readonly signer: EthersSigner,
    @InjectContractProvider()
    private readonly contract: EthersContract,
  ) {}

  async getElection(electionId: string) {
    const id = Number(electionId);
    const election = await this.prisma.election.findUnique({
      where: { id },
      include: { registeredVoters: true, eligibleVoters: true },
    });
    if (!election) throw new NotFoundException({ message: 'error.api.election.notFound' });
    return election;
  }

  async getElections() {
    await this.prisma.election.findMany({
      include: { registeredVoters: true, eligibleVoters: true },
    });
  }

  async createElection(dto: ElectionCreateDto, id: number) {
    // get admin
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin) throw new ForbiddenException('error.api.election.wrongServiceNumber');
    // create admin signer and contract factory
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

  async updateElection(dto: ElectionUpdateDto, electionId: string) {
    // get election
    const election = await this.getElection(electionId);

    try {
      // update election
      return this.prisma.election.update({
        data: dto,
        where: { id: election.id },
      });
    } catch (error) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    }
  }

  async closeElection(electionId: string) {
    // get election
    const election = await this.getElection(electionId);
    // create signer and contract instance
    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const contract = this.contract.create(election.contract, Election__factory.abi, signer);

    try {
      // close election
      await contract.functions.closeElection();
      const expires = await contract.callStatic.expires();
      const results = await contract.callStatic.getResults();
      const decodedResults = results.map(([name, voteCount]) => ({ name, voteCount: voteCount.toNumber() }));

      // TODO update db entry
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

  async addEligibleVoter(dto: EligibleCreateDto) {
    try {
      return dto.eligibleVoters.map(async (voter) => {
        return await this.prisma.eligibleVoter.create({
          data: {
            ssn: voter.ssn,
            election: {
              connect: {
                id: voter.electionId,
              },
            },
          },
        });
      });
    } catch (error) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    }
  }

  async updateEligibleVoter(dto: EligibleUpdateDto, eligibleId: string) {
    try {
      await this.prisma.eligibleVoter.update({
        where: { id: Number(eligibleId) },
        data: { ssn: dto.ssn ?? null, wallet: dto.wallet ?? null },
      });
    } catch (error) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    }
  }

  async deleteEligibleVoter(dto: EligibleDeleteDto) {
    try {
      await this.prisma.eligibleVoter.deleteMany({ where: { id: { in: dto.ids } } });
    } catch (error) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    }
  }
}
