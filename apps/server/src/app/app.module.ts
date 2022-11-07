import { Module } from '@nestjs/common';
import { PrismaModule } from '@dvs/prisma';
import { AuthModule, CoreModule, ElectionModule, JwtModule } from '@dvs/api';

@Module({
  imports: [CoreModule, AuthModule, JwtModule, PrismaModule, ElectionModule],
})
export class AppModule {}
