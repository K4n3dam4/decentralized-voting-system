import { Body, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
    return this.$transaction([this.election.deleteMany(), this.admin.deleteMany(), this.voter.deleteMany()]);
  }

  async withAdmin(@Body() dto: AdminDto) {
    const admin = {
      data: dto,
    };
    await this.admin.create(admin);
  }
}
