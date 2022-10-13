import { Body, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Admin, RegisteredVoter } from './prisma.dto';

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
    return this.$transaction([this.admin.deleteMany(), this.registeredVoter.deleteMany(), this.voter.deleteMany()]);
  }

  async withAdmin(@Body() dto: Admin) {
    const admin = {
      data: dto,
    };
    await this.admin.create(admin);
  }

  async withRegisteredVoter(@Body() dto: RegisteredVoter) {
    const registeredVoter = {
      data: dto,
    };
    await this.registeredVoter.create(registeredVoter);
  }
}
