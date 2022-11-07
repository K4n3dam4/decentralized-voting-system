import { Body, Controller, Get, HttpCode, Post, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, VoterSignupDto } from './auth.dto';
import { GetUser, Public, Roles } from '../decorators';
import { JwtPayload, RoleEnum } from '../types';
import { RolesGuard } from '../guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() dto: VoterSignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Roles(RoleEnum.Voter, RoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Get('verify')
  async verify(@GetUser('role') role: JwtPayload['role']) {
    console.log(role);
    return { role };
  }
}
