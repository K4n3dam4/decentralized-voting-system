import { Exclude, Type } from 'class-transformer';
import { Election } from '@prisma/client';
import { IsObjectArray } from '../decorators';

export class RegisteredVoter {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  electionId: number;
}

export class EligibleVoter {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  electionId: number;

  ssn?: string;
  wallet?: string;
}

export class ElectionEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  adminId: number;

  name: string;
  image: string;
  candidates: Election['candidates'];
  contract: string;
  @Exclude()
  @IsObjectArray()
  @Type(() => EligibleVoter)
  eligibleVoters: EligibleVoter[];
  @Exclude()
  registeredVoters: RegisteredVoter[];
  registered: boolean;
  expires: Date;

  constructor(partial: Partial<ElectionEntity>) {
    Object.assign(this, partial);
  }
}
