import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VoterSignin, VoterSignup } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: VoterSignup) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: VoterSignin) {
    return this.authService.signin(dto);
  }
}
