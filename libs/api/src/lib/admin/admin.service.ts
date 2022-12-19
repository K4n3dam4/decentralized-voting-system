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
import { ElectionCreateDto, ElectionUpdateDto, EligibleCreateDto, EligibleDeleteDto, EligibleUpdateDto } from '.';
import { RoleEnum } from '../types';
import { AdminElectionEntity, UserEntity } from './admin.entity';

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

  mapToMonths = (data: any & { createdAt: Date }[], months: number[]) => {
    return months.map((_month, index) => {
      const created = data.filter((item) => {
        const electionDate = new Date(item.createdAt);
        const electionMonth = electionDate.getMonth();
        const electionYear = electionDate.getFullYear();
        const year = new Date().getFullYear();

        if (electionYear === year && electionMonth === index) return item;
      });
      return created.length;
    });
  };

  async getOverview() {
    const createdCurrentYear = {
      createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        lt: new Date(new Date().getFullYear(), 11, 31).toISOString(),
      },
    };
    const opened = {
      expires: {
        gte: new Date().toISOString(),
      },
    };
    const closed = {
      expires: {
        gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        lt: new Date().toISOString(),
      },
    };
    const voters = await this.prisma.user.findMany({
      where: { role: 'VOTER' },
      include: { registered: true },
    });
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: { elections: true },
    });
    const elections = await this.prisma.election.findMany({
      where: createdCurrentYear,
    });
    const openElections = await this.prisma.election.findMany({
      where: { expires: opened.expires },
    });
    const closedElections = await this.prisma.election.findMany({
      where: { expires: closed.expires, createdAt: createdCurrentYear.createdAt },
    });
    const [latestElection] = await this.prisma.election.findMany({
      include: {
        registeredVoters: true,
        eligibleVoters: true,
      },
      take: -1,
    });

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return {
      all: {
        months,
        dataSets: [
          {
            label: 'Elections',
            data: this.mapToMonths(voters, months),
          },
          {
            label: 'Voters',
            data: this.mapToMonths(admins, months),
          },
          {
            label: 'Admins',
            data: this.mapToMonths(elections, months),
          },
        ],
      },
      users: {
        dataSets: [
          {
            label: 'Admins',
            data: [admins.length],
          },
          {
            label: 'Voters',
            data: [voters.length],
          },
        ],
      },
      elections: {
        months,
        dataSets: [
          {
            label: 'admin.overview.allElections',
            data: this.mapToMonths(elections, months),
          },
          {
            label: 'admin.overview.openElections',
            data: this.mapToMonths(openElections, months),
          },
          {
            label: 'admin.overview.closedElections',
            data: this.mapToMonths(closedElections, months),
          },
        ],
      },
      latestElection: {
        dataSets: [
          {
            data: [
              latestElection.eligibleVoters.length,
              latestElection.registeredVoters.length,
              JSON.parse(JSON.stringify(latestElection.candidates)).length,
            ],
          },
        ],
      },
    };
  }

  async getElection(electionId: string) {
    const id = Number(electionId);
    let election = await this.prisma.election.findUnique({
      where: { id },
      include: { registeredVoters: true, eligibleVoters: true },
    });
    if (!election) throw new NotFoundException({ message: 'error.api.election.notFound' });

    if (
      election.expires.getTime() <= new Date().getTime() &&
      !{}.hasOwnProperty.call(election.candidates[0], 'winner')
    ) {
      const closedElection = await this.closeElection(electionId);

      if (closedElection)
        election = {
          ...closedElection,
          registeredVoters: election.registeredVoters,
          eligibleVoters: election.eligibleVoters,
        };
    }

    return new AdminElectionEntity({
      ...election,
      totalEligibleVoters: election.eligibleVoters.length,
      totalRegisteredVoters: election.registeredVoters.length,
    });
  }

  async getElections() {
    const elections = await this.prisma.election.findMany({
      include: { registeredVoters: true, eligibleVoters: true },
    });
    if (!elections) throw new NotFoundException({ message: 'error.api.election.notFound' });

    return elections.map((election) => {
      const totalRegisteredVoters = election.registeredVoters.length;
      const totalEligibleVoters = election.eligibleVoters.length;
      return new AdminElectionEntity({
        ...election,
        totalEligibleVoters,
        totalRegisteredVoters,
      });
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
    const election = await this.prisma.election.findUnique({ where: { id: Number(electionId) } });
    // create signer and contract instance
    const signer = this.signer.createWallet(this.config.get('adminPk'));
    const contract = this.contract.create(election.contract, Election__factory.abi, signer);

    try {
      // close election
      const tsx = await contract.functions.closeElection();
      // wait for transaction
      await tsx.wait();

      const expires = await contract.callStatic.expires();
      const result = await contract.callStatic.getResults();

      // calc result
      let candidates = JSON.parse(JSON.stringify(election.candidates));
      type candidate = {
        name: string;
        party: string;
        voteCount: number;
        winner: boolean;
        draw: boolean;
        image?: string;
      };

      const decodedResult = result.map(([name, voteCount]) => ({
        ...candidates.find((candidate) => candidate.name === name),
        voteCount: voteCount.toNumber(),
      }));
      const draw: candidate[] = [];
      const hasDraw = (candidate: candidate) => draw.some((draw) => draw.name === candidate.name);

      const winner = decodedResult.reduce((prev: candidate, current: candidate) => {
        if (prev.voteCount === current.voteCount) {
          if (!hasDraw(prev)) draw.push(prev);
          if (!hasDraw(current)) draw.push(current);
          return prev;
        }
        return prev.voteCount > current.voteCount ? prev : current;
      });
      candidates = decodedResult.map((candidate) => ({
        ...candidate,
        winner: !hasDraw(candidate) && candidate.name === winner.name,
        draw: hasDraw(candidate),
      }));

      // update db
      return await this.prisma.election.update({
        where: { id: election.id },
        data: { candidates, expires: new Date(expires * 1000) },
      });
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

  async getUsers() {
    const users = await this.prisma.user.findMany({ where: { role: RoleEnum.Voter } });
    if (!users) throw new NotFoundException('error.api.users.notFound');
    return users.map((user) => new UserEntity({ ...user }));
  }
}
