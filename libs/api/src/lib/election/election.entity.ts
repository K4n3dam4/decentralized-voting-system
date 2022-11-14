import { Exclude } from 'class-transformer';
import { Election } from '@prisma/client';

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
  eligibleVoters: string[];
  expires: Date;

  constructor(partial: Partial<ElectionEntity>) {
    Object.assign(this, partial);
  }
}
