import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as JwtNestModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtStrategy } from '../strategies';
import { JwtGuard, RolesGuard } from '../guards';

@Global()
@Module({
  imports: [
    JwtNestModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: {
          expiresIn: config.get('jwtExpiration'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtGuard, RolesGuard],
  exports: [JwtNestModule],
})
export class JwtModule {}
