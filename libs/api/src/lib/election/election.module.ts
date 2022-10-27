import { Module } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ElectionController],
  providers: [ElectionService],
  exports: [ElectionService],
})
export class ElectionModule {}
