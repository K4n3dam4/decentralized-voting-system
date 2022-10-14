import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('elections')
export class ElectionsController {
  constructor(private electionsService: ElectionsService) {}

  @Get('get/all')
  getAllElections(@Req() req: Request) {
    return req.user;
  }

  @Get('get/:id')
  getElection() {
    return;
  }
}
