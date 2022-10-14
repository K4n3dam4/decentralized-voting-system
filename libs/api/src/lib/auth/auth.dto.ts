import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoterSignup {
  @IsString()
  @IsNotEmpty()
  socialSecurity: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsString()
  street: string;
  @IsNotEmpty()
  @IsInt()
  postalCode: number;
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VoterSignin {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
