import { Exclude, Type } from 'class-transformer';
import { IsObjectArray } from '../decorators';
import { EligibleVoter, RegisteredVoter } from '../election/election.entity';
import { Election } from '@prisma/client';

export class AdminElectionEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  adminId: number;

  name: string;
  image: string;
  candidates: Election['candidates'];
  contract: string;
  @Exclude()
  @IsObjectArray()
  @Type(() => EligibleVoter)
  eligibleVoters: EligibleVoter[];
  totalEligibleVoters: number;
  @Exclude()
  registeredVoters: RegisteredVoter[];
  totalRegisteredVoters: number;
  expires: Date;

  constructor(partial: Partial<AdminElectionEntity>) {
    Object.assign(this, partial);
  }
}

export class UserEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  role: string;
  @Exclude()
  ssn: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: number;
  city: string;
  @Exclude()
  serviceNumber: number;
  email: string;
  @Exclude()
  hash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
