import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ElectionService } from './election.service';
import { ElectionCreateDto, ElectionRegisterDto, ElectionVoteDto } from './election.dto';
import { GetUser } from '../decorator';

@Controller('election')
export class ElectionController {
  constructor(private electionsService: ElectionService) {}

  @UseGuards(AuthGuard(['Voter', 'Admin']))
  @Get('single/:id')
  getElection(@Param('id') id: string) {
    return this.electionsService.getElection(id);
  }

  @UseGuards(AuthGuard(['Voter', 'Admin']))
  @Get('all')
  getAllElections() {
    return this.electionsService.getAllElections();
  }

  @UseGuards(AuthGuard('Admin'))
  @Post('create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('serviceNumber') serviceNumber) {
    return this.electionsService.createElection(dto, serviceNumber);
  }

  @UseGuards(AuthGuard('Voter'))
  @Post('register/:id')
  registerVoter(@Body() dto: ElectionRegisterDto, @Param('id') id: string) {
    return this.electionsService.registerVoter(dto, id);
  }

  @UseGuards(AuthGuard('Voter'))
  @Post('vote/:id')
  vote(@Body() dto: ElectionVoteDto, @Param('id') id: string) {
    return this.electionsService.vote(dto, id);
  }
}
