import { Injectable } from '@nestjs/common';
import { PrismaService } from '@dvs/prisma';
import { VoterSignin, VoterSignup } from './auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: VoterSignup) {
    // hash password
    const hash = await argon.hash(dto.password);
    // add voter

    const voter = await this.prisma.voters.create({
      data: {
        username: dto.username,
        hash,
        privateKey: 'myPrivateKey',
        publicKey: 'myPublicKey',
      },
    });
    return voter;
  }
  signin(dto: VoterSignin) {
    return dto;
  }
}
