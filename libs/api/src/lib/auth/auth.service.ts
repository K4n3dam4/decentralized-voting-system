import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '@dvs/prisma';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import { SigninDto, VoterSignupDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async signup(dto: VoterSignupDto) {
    // hash password
    const hash = await argon.hash(dto.password);
    delete dto.password;
    // hash social security number
    dto.ssn = await argon.hash(dto.ssn, { salt: Buffer.from(this.config.get('salt')) });
    // add voter
    try {
      const voter = await this.prisma.user.create({
        data: {
          ...dto,
          hash,
        },
      });

      // return voter
      return this.signJwtToken({ id: voter.id, email: voter.email, role: voter.role });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('error.api.auth.alreadyRegistered');
        }
      }
      throw error;
    }
  }
  async signin(dto: SigninDto) {
    // find user
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // voter does not exist
    if (!user) throw new ForbiddenException('error.api.auth.wrongEmail');
    // compare password
    const matchHash = await argon.verify(user.hash, dto.password);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('error.api.auth.wrongPassword');

    // return voter
    return this.signJwtToken({ id: user.id, email: user.email, role: user.role });
  }

  async signJwtToken(payload: JwtPayload) {
    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
