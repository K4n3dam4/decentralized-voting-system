import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ElectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  candidates: string[];

  @IsNotEmpty()
  @IsArray()
  eligibleVoters: string[];

  @IsNotEmpty()
  @IsInt()
  expires: number;
}
