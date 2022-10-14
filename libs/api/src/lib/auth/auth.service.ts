import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '@dvs/prisma';
import { VoterSignin, VoterSignup } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async signup(dto: VoterSignup) {
    // hash password
    const hash = await argon.hash(dto.password);
    delete dto.password;
    // hash social security number
    dto.socialSecurity = await argon.hash(dto.socialSecurity, { salt: Buffer.from(this.config.get('salt')) });
    // add voter
    try {
      const voter = await this.prisma.voter.create({
        data: {
          ...dto,
          hash,
        },
      });

      // return voter
      return this.signJwtToken(voter.id, voter.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('signup.forbidden.alreadyRegistered');
        }
      }
      throw error;
    }
  }
  async signin(dto: VoterSignin) {
    // find user
    const voter = await this.prisma.voter.findUnique({ where: { email: dto.email } });
    // if user does not exist throw error
    if (!voter) throw new ForbiddenException('signin.forbidden.wrongUsername');

    // compare password
    const matchHash = await argon.verify(voter.hash, dto.password);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('signin.forbidden.wrongPassword');

    // return voter
    return this.signJwtToken(voter.id, voter.email);
  }

  async signJwtToken(id: number, email: string) {
    const secret = this.config.get('jwtSecret');
    const payload = {
      sub: id,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
