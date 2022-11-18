import { Body, Injectable } from '@nestjs/common';
import { PrismaClient, EligibleVoter } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { AdminDto } from './prisma.dto';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  withCleanDatabase() {
    return this.$transaction([this.election.deleteMany(), this.user.deleteMany()]);
  }

  async withAdmin(@Body() dto: AdminDto) {
    const admin = {
      data: { ...dto, role: 'ADMIN' as any },
    };
    await this.user.create(admin);
  }

  async getEligibleVoter(): Promise<EligibleVoter> {
    const voters = await this.eligibleVoter.findMany();
    return voters[1];
  }
}
