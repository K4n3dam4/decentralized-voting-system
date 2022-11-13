import { Body, Controller, Get, Post, UseGuards, Param, HttpCode } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionCreateDto, ElectionEligibleDto, ElectionRegisterDto, ElectionVoteDto } from './election.dto';
import { GetUser, Roles } from '../decorators';
import { RolesGuard } from '../guards';
import { RoleEnum } from '../types';

@Controller('election')
export class ElectionController {
  constructor(private electionsService: ElectionService) {}

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Get('single/:id')
  getElection(@Param('id') id: string) {
    return this.electionsService.getElection(id);
  }

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Get('all')
  getAllElections() {
    return this.electionsService.getAllElections();
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post('create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('id') id: number) {
    return this.electionsService.createElection(dto, id);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @Post('register/:id')
  registerVoter(@Body() dto: ElectionRegisterDto, @Param('id') id: string) {
    return this.electionsService.registerVoter(dto, id);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Post('eligible/:id')
  eligibleVoter(@Body() dto: ElectionEligibleDto, @Param('id') id: string) {
    return this.electionsService.eligibleVoter(dto, id);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @Post('vote/:id')
  vote(@Body() dto: ElectionVoteDto, @Param('id') id: string) {
    return this.electionsService.vote(dto, id);
  }
}
