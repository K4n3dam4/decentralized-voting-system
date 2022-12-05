import { Exclude } from 'class-transformer';

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
