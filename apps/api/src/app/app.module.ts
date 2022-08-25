import { Module } from '@nestjs/common';
import { AuthModule } from '@dvs/api/auth';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
