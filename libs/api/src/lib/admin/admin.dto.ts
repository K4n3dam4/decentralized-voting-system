import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsObjectArray } from '../decorators';
import { Type } from 'class-transformer';

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

class EligibleVoter {
  @IsNotEmpty()
  @IsNumber()
  electionId: number;

  @IsNotEmpty()
  @IsString()
  ssn: string;
}

export class EligibleCreateDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EligibleVoter)
  eligibleVoters: EligibleVoter[];
}

export class EligibleUpdateDto {
  @IsString()
  @IsOptional()
  ssn?: string;

  @IsString()
  @IsOptional()
  wallet?: string;
}

export class EligibleDeleteDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
