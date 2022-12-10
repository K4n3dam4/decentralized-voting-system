import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionEligibleDto, ElectionRegisterDto, ElectionVoteDto, ElectionEntity } from '.';
import { GetUser, Roles } from '../decorators';
import { RolesGuard } from '../guards';
import { RoleEnum } from '../types';

@Controller('election')
export class ElectionController {
  constructor(private electionsService: ElectionService) {}

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('single/:id')
  async getElection(@GetUser('id') userId: number, @Param('id') electionId: string): Promise<ElectionEntity> {
    return await this.electionsService.getElection(userId, electionId);
  }

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  async getAllElections(): Promise<ElectionEntity[]> {
    return await this.electionsService.getAllElections();
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @Post('register/:id')
  registerVoter(@Body() dto: ElectionRegisterDto, @GetUser('id') userId: number, @Param('id') id: string) {
    return this.electionsService.registerVoter(dto, userId, id);
  }

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Post('eligible/:id')
  eligibleVoter(@Body() dto: ElectionEligibleDto, @Param('id') electionId: string) {
    return this.electionsService.eligibleVoter(dto, electionId);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @Post('vote/:id')
  vote(@Body() dto: ElectionVoteDto, @GetUser('id') userId: number, @Param('id') electionId: string) {
    return this.electionsService.vote(dto, userId, electionId);
  }
}
