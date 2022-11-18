import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionModule, JwtModule } from '@dvs/api';
import { AdminModule } from '../../../../libs/api/src/lib/admin';

@Module({
  imports: [CoreModule, AuthModule, JwtModule, PrismaModule, AdminModule, ElectionModule],
})
export class AppModule {}
