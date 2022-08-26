import { Module } from '@nestjs/common';
import { CoreModule } from '@dvs/api-core';
import { AuthModule } from '@dvs/api/auth';
import { PrismaModule } from '@dvs/api/prisma';

@Module({
  imports: [CoreModule, PrismaModule, AuthModule],
})
export class AppModule {}
