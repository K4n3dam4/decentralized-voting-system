import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api-auth')
export class AuthController {
  constructor(private apiAuthService: AuthService) {}
}