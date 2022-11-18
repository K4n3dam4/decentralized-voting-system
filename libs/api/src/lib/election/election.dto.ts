import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsMnemonic } from '../decorators';

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
