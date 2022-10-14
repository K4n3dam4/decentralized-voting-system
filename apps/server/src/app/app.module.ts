import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionsModule } from '@dvs/api';

@Module({
  imports: [CoreModule, AuthModule, PrismaModule, ElectionsModule],
})
export class AppModule {}
