import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VoterSignupDto {
  @IsString()
  @IsNotEmpty()
  ssn: string;
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
  @IsNumber()
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
  @IsNumber()
  serviceNumber: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
