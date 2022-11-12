import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsObjectArray } from '../decorators';

export class Candidates {
  @IsString()
  name: string;

  @IsString()
  image?: string;

  @IsString()
  party?: string;
}

export class ElectionCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsObjectArray()
  @ValidateNested()
  @Type(() => Candidates)
  candidates: Candidates[];

  @IsNotEmpty()
  @IsArray()
  eligibleVoters: string[];

  @IsNotEmpty()
  @IsNumber()
  expires: number;
}

export class ElectionRegisterDto {
  @IsNotEmpty()
  @IsString()
  ssn: string;
}

export class ElectionVoteDto {
  @IsNotEmpty()
  @IsString()
  mnemonic: string;

  @IsNotEmpty()
  @IsNumber()
  candidate: number;
}
