import { Module } from '@nestjs/common';
import { AdminElectionController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminElectionController],
  providers: [AdminService],
})
export class AdminModule {}
