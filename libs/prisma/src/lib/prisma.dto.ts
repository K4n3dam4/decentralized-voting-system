import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class Admin {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  serviceNumber: number;
}
