import { Headers, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ElectionService } from './election.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ElectionDto } from './election.dto';

@Controller('election')
export class ElectionController {
  constructor(private electionsService: ElectionService) {}

  @UseGuards(AuthGuard(['Voter', 'Admin']))
  @Get('get/all')
  getAllElections(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthGuard(['Voter', 'Admin']))
  @Get('get/:id')
  getElection() {
    return;
  }

  @UseGuards(AuthGuard('Admin'))
  @Post('create')
  createElection(@Headers() { authorization }, @Body() dto: ElectionDto) {
    return this.electionsService.createElection(authorization, dto);
  }
}
