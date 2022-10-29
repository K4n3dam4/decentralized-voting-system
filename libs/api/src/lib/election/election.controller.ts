import { Headers, Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { ElectionService } from './election.service';
import { AuthGuard } from '@nestjs/passport';
import { ElectionCreateDto, ElectionRegisterDto, ElectionVoteDto } from './election.dto';

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
  createElection(@Headers() { authorization }, @Body() dto: ElectionCreateDto) {
    return this.electionsService.createElection(authorization, dto);
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
