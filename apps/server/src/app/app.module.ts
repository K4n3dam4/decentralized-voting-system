import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionModule, JwtModule } from '@dvs/api';
import { AdminModule } from '@dvs/api';

@Module({
  imports: [CoreModule, AuthModule, JwtModule, PrismaModule, AdminModule, ElectionModule],
})
export class AppModule {}
