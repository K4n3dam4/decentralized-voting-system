import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsMnemonic, IsObjectArray } from '../decorators';

export class Candidates {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
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

export class ElectionEligibleUpdateDto {
  @IsString()
  @IsOptional()
  ssn?: string;

  @IsString()
  @IsOptional()
  wallet?: string;
}

export class ElectionRegisterDto {
  @IsNotEmpty()
  @IsString()
  ssn: string;
}

export class ElectionEligibleDto {
  @IsNotEmpty()
  @IsMnemonic()
  mnemonic: string;
}

export class ElectionVoteDto {
  @IsNotEmpty()
  @IsMnemonic()
  mnemonic: string;

  @IsNotEmpty()
  @IsNumber()
  candidate: number;
}
