import { Headers, Body, Controller, Get, HttpCode, Post, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, VoterSignupDto } from './auth.dto';
import { Public } from '../decorators';

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

  @Get('verify/:user')
  async verify(@Headers() { authorization }, @Param('user') user) {
    return this.authService.verify(authorization, user);
  }
}
