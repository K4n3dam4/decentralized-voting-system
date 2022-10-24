import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionModule } from '@dvs/api';

@Module({
  imports: [CoreModule, AuthModule, PrismaModule, ElectionModule],
})
export class AppModule {}
