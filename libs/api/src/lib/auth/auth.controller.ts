import { Headers, Body, Controller, Get, HttpCode, Post, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSigninDto, VoterSigninDto, VoterSignupDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: VoterSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: VoterSigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signin/admin')
  @HttpCode(HttpStatus.OK)
  signInAdmin(@Body() dto: AdminSigninDto) {
    return this.authService.adminSignin(dto);
  }

  @Get('verify/:user')
  async verify(@Headers() { authorization }, @Param('user') user) {
    return this.authService.verify(authorization, user);
  }
}
