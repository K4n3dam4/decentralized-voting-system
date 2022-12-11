import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetUser, Roles } from '../decorators';
import { RoleEnum } from '../types';
import { RolesGuard } from '../guards';
import {
  ElectionCreateDto,
  ElectionUpdateDto,
  EligibleCreateDto,
  EligibleDeleteDto,
  EligibleUpdateDto,
} from './admin.dto';
import { AdminElectionEntity, UserEntity } from './admin.entity';

@Roles(RoleEnum.Admin)
@UseGuards(RolesGuard)
@Controller('admin')
export class AdminElectionController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('election/single/:id')
  async getElection(@Param('id') electionId: string): Promise<AdminElectionEntity> {
    return await this.adminService.getElection(electionId);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('election/all')
  async getElections(): Promise<AdminElectionEntity[]> {
    return await this.adminService.getElections();
  }

  @Post('election/create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('id') id: number) {
    return this.adminService.createElection(dto, id);
  }

  @Put('election/update/:id')
  updateElection(@Body() dto: ElectionUpdateDto, @Param('id') electionId: string) {
    return this.adminService.updateElection(dto, electionId);
  }

  @Put('election/close/:id')
  closeElection(@Param('id') electionId: string) {
    return this.adminService.closeElection(electionId);
  }

  @Post('election/add/voter')
  addEligibleVoter(@Body() dto: EligibleCreateDto) {
    return this.adminService.addEligibleVoter(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('election/update/voter/:id')
  updateEligibleVoter(@Body() dto: EligibleUpdateDto, @Param('id') eligibleId: string) {
    return this.adminService.updateEligibleVoter(dto, eligibleId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('election/delete/voter')
  deleteEligibleVoter(@Body() dto: EligibleDeleteDto) {
    return this.adminService.deleteEligibleVoter(dto);
  }

  @Get('user/all')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(): Promise<UserEntity[]> {
    return this.adminService.getUsers();
  }
}
