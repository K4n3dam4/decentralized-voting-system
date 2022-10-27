import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategyVoter extends PassportStrategy(Strategy, 'Voter') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwtSecretVoter'),
    });
  }

  validate(payload: { id: string; email: string }) {
    return payload;
  }
}

@Injectable()
export class JwtStrategyAdmin extends PassportStrategy(Strategy, 'Admin') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwtSecretAdmin'),
    });
  }

  validate(payload: { id: string; serviceNumber: string }) {
    return payload;
  }
}
