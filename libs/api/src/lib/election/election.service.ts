import { ForbiddenException, Injectable } from '@nestjs/common';
import { ElectionDto } from './election.dto';
import { AdminDto, PrismaService } from '@dvs/prisma';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ElectionService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async createElection(bearer: string, dto: ElectionDto) {
    // get token
    const token = bearer.split(' ')[1];
    // decode token
    const { serviceNumber } = this.jwt.decode(token) as Partial<AdminDto>;
    // get admin
    const admin = await this.prisma.admin.findUnique({ where: { serviceNumber } });
    if (!admin) throw new ForbiddenException('signin.forbidden.wrongServiceNumber');

    console.log(admin);

    const dbElection = await this.prisma.election.create({
      data: {
        contract: '',
        eligibleVoters: dto.eligibleVoters,
        admin: {
          connect: {
            id: admin.id,
          },
        },
      },
    });

    console.log(dbElection);
  }
}
