import { Module } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';

@Module({
  controllers: [ElectionController],
  providers: [ElectionService],
  exports: [ElectionService],
})
export class ElectionModule {}
