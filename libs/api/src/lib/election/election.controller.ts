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
  Put,
} from '@nestjs/common';
import { ElectionService } from './election.service';
import {
  ElectionCreateDto,
  ElectionEligibleDto,
  ElectionEligibleUpdateDto,
  ElectionRegisterDto,
  ElectionVoteDto,
} from './election.dto';
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

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post('create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('id') id: number) {
    return this.electionsService.createElection(dto, id);
  }

  @Roles(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Put('eligible/update/:id')
  updateEligibleVoter(@Body() dto: ElectionEligibleUpdateDto, @Param('id') eligibleId: string) {
    return this.electionsService.updateEligibleVoter(dto, eligibleId);
  }

  @Roles(RoleEnum.Voter)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register/:id')
  registerVoter(@Body() dto: ElectionRegisterDto, @GetUser('id') userId: number, @Param('id') id: string) {
    return this.electionsService.registerVoter(dto, userId, id);
  }

  @Roles(RoleEnum.Voter)
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
