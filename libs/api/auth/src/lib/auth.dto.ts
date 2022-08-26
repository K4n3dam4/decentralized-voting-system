import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoterSignup {
  @IsInt()
  @IsNotEmpty()
  socialSecurity: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
