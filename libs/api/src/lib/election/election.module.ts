import { Module } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';
import { AdminService } from '../admin/admin.service';

@Module({
  controllers: [ElectionController],
  providers: [ElectionService, AdminService],
  exports: [ElectionService],
})
export class ElectionModule {}
