import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoterSignup {
  @IsInt()
  @IsNotEmpty()
  socialSecurity: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VoterSignin {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
