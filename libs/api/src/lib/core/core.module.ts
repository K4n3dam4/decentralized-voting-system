import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, validationSchema } from './';
import { EthersCoreModule } from 'nestjs-ethers/dist/ethers-core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    EthersCoreModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        network: config.get('environment') === 'production' ? 'matic' : 'maticmum',
        alchemy: config.get('alchemyAPIKey'),
        waitUntilIsConnected: true,
        useDefaultProvider: false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
