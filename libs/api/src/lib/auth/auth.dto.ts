import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
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

export class VoterSignupDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  ssn: string;
}

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
