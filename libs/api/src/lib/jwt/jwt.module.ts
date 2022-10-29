import { Global, Module } from '@nestjs/common';
import { JwtModule as JwtNestModule } from '@nestjs/jwt';
import { JwtStrategyAdmin, JwtStrategyVoter } from './jwt.strategy';

@Global()
@Module({
  imports: [JwtNestModule.register({})],
  providers: [JwtStrategyVoter, JwtStrategyAdmin],
  exports: [JwtNestModule],
})
export class JwtModule {}
