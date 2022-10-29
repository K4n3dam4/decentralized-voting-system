import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ElectionCreateDto {
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
