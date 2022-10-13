import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Admin {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  employeeNumber: number;
}

export class RegisteredVoter {
  @IsInt()
  @IsNotEmpty()
  socialSecurity: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsBoolean()
  @IsNotEmpty()
  hasRegistered: boolean;
}
