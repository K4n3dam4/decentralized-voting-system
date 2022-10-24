import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ElectionService } from './election.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('election')
export class ElectionController {
  constructor(private electionsService: ElectionService) {}

  @Get('get/all')
  getAllElections(@Req() req: Request) {
    return req.user;
  }

  @Get('get/:id')
  getElection() {
    return;
  }
}
