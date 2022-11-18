import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetUser, Roles } from '../decorators';
import { RoleEnum } from '../types';
import { RolesGuard } from '../guards';
import { ElectionCreateDto, EligibleCreateDto, EligibleDeleteDto, EligibleUpdateDto } from './admin.dto';

@Roles(RoleEnum.Admin)
@UseGuards(RolesGuard)
@Controller('admin/election')
export class AdminElectionController {
  constructor(private adminService: AdminService) {}

  @Get('single/:id')
  getElection(@Param('id') electionId: string) {
    return this.adminService.getElection(electionId);
  }

  @Get('all')
  getElections() {
    return this.adminService.getElections();
  }

  @Post('create')
  createElection(@Body() dto: ElectionCreateDto, @GetUser('id') id: number) {
    return this.adminService.createElection(dto, id);
  }

  @Post('add/voter')
  addEligibleVoter(@Body() dto: EligibleCreateDto) {
    return this.adminService.addEligibleVoter(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('update/voter/:id')
  updateEligibleVoter(@Body() dto: EligibleUpdateDto, @Param('id') eligibleId: string) {
    return this.adminService.updateEligibleVoter(dto, eligibleId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete/voter')
  deleteEligibleVoter(@Body() dto: EligibleDeleteDto) {
    return this.adminService.deleteEligibleVoter(dto);
  }
}
