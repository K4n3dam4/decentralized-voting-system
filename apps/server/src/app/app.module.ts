import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule } from '@dvs/api';

@Module({
  imports: [CoreModule, AuthModule, PrismaModule],
})
export class AppModule {}
