import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@dvs/prisma';
import { VoterSignin, VoterSignup } from './auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: VoterSignup) {
    // find social security number in registered voters list
    const registeredVoter = await this.prisma.registeredVoter.findFirst({
      where: { socialSecurity: dto.socialSecurity, hasRegistered: false },
    });
    //  if voter is not found or has already registered throw error
    if (!registeredVoter) throw new ForbiddenException('signup.forbidden.notEligible');

    // hash password
    const hash = await argon.hash(dto.password);
    // add voter
    try {
      const voter = await this.prisma.voter.create({
        data: {
          username: dto.username,
          hash,
          privateKey: 'myPrivateKey',
          publicKey: 'myPublicKey',
        },
      });

      // update registered voter
      await this.prisma.registeredVoter.update({
        where: { socialSecurity: dto.socialSecurity },
        data: { hasRegistered: true },
      });

      // return voter
      delete voter.hash;
      return voter;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('signup.forbidden.takenUsername');
        }
      }
      throw error;
    }
  }
  async signin(dto: VoterSignin) {
    // find user
    const voter = await this.prisma.voter.findUnique({ where: { username: dto.username } });
    // if user does not exist throw error
    if (!voter) throw new ForbiddenException('signin.forbidden.wrongUsername');

    // compare password
    const matchHash = await argon.verify(voter.hash, dto.password);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('signin.forbidden.wrongPassword');

    // return voter
    delete voter.hash;
    return voter;
  }
}
