import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '@dvs/prisma';
import { AdminSigninDto, VoterSigninDto, VoterSignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

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
      const voter = await this.prisma.voter.create({
        data: {
          ...dto,
          hash,
        },
      });

      // return voter
      return this.signJwtToken('Voter', { id: voter.id, email: voter.email });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('signup.forbidden.alreadyRegistered');
        }
      }
      throw error;
    }
  }
  async signin(dto: VoterSigninDto) {
    // find user
    const voter = await this.prisma.voter.findUnique({ where: { email: dto.email } });
    // voter does not exist
    if (!voter) throw new ForbiddenException('signin.forbidden.wrongEmail');
    // compare password
    const matchHash = await argon.verify(voter.hash, dto.password);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('signin.forbidden.wrongPassword');

    // return voter
    return this.signJwtToken('Voter', { id: voter.id, email: voter.email });
  }

  async adminSignin(dto: AdminSigninDto) {
    // find admin
    const admin = await this.prisma.admin.findUnique({ where: { serviceNumber: dto.serviceNumber } });
    // if admin does not exist throw error
    if (!admin) throw new ForbiddenException('signin.forbidden.wrongServiceNumber');

    // compare password
    const matchHash = await argon.verify(admin.hash, dto.password);
    // mismatched hash
    if (!matchHash) throw new ForbiddenException('signin.forbidden.wrongPassword');

    // return admin
    return this.signJwtToken('Admin', { id: admin.id, serviceNumber: admin.serviceNumber });
  }

  async verify(authorization: string) {
    if (!authorization) throw new ForbiddenException('token.notFound');

    const secret = this.config.get('jwtSecretVoter');
    try {
      this.jwt.verify(authorization, { secret });
    } catch (e) {
      throw new ForbiddenException('token.invalid');
    }
  }

  async signJwtToken(type: 'Admin' | 'Voter', payload: { id: number; email?: string; serviceNumber?: number }) {
    const secret = this.config.get(`jwtSecret${type}`);

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
