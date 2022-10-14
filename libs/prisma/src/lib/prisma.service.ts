import { Body, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Admin } from './prisma.dto';

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
    return this.$transaction([this.admin.deleteMany(), this.voter.deleteMany()]);
  }

  async withAdmin(@Body() dto: Admin) {
    const admin = {
      data: dto,
    };
    await this.admin.create(admin);
  }
}
