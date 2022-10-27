import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionModule, JwtModule } from '@dvs/api';

@Module({
  imports: [CoreModule, JwtModule, AuthModule, PrismaModule, ElectionModule],
})
export class AppModule {}
