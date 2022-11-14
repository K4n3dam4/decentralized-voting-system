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
import { ElectionCreateDto, ElectionEligibleDto, ElectionRegisterDto, ElectionVoteDto } from './election.dto';
import { ElectionEntity } from './election.entity';
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
  async getElection(@Param('id') id: string): Promise<ElectionEntity> {
    return await this.electionsService.getElection(id);
  }

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  async getAllElections(): Promise<ElectionEntity[]> {
    return await this.electionsService.getAllElections();
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post('create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('id') id: number) {
    return this.electionsService.createElection(dto, id);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
