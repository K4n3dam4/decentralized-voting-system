import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminDto {
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
  @IsString()
  @IsNotEmpty()
  hash: string;

  @IsInt()
  @IsNotEmpty()
  serviceNumber: number;
}
