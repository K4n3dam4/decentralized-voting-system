import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  serviceNumber: number;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
