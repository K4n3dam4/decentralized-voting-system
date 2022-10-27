import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VoterSignupDto {
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

export class VoterSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AdminSigninDto {
  @IsNotEmpty()
  @IsInt()
  serviceNumber: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
