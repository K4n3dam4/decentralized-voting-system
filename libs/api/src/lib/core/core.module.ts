import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, validationSchema } from './';
import { EthersCoreModule } from 'nestjs-ethers/dist/ethers-core.module';
import { AlchemyProvider, Network } from '@ethersproject/providers';
import { EthersModuleOptions, InjectEthersProvider } from 'nestjs-ethers';

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
      useFactory: async (config: ConfigService) => {
        const environment = config.get('environment');
        const network: { [k: string]: string | Network } = {
          test: {
            name: 'ganache',
            chainId: 1337,
          },
          development: 'maticmum',
          production: 'matic',
        };

        const options: EthersModuleOptions = {
          network: network[environment],
          waitUntilIsConnected: true,
          useDefaultProvider: false,
          alchemy: config.get('alchemyAPIKey'),
        };

        if (environment === 'test') {
          delete options.alchemy;
          options.custom = 'http://127.0.0.1:8545';
        }

        return options;
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {
  constructor(
    private readonly config: ConfigService,
    @InjectEthersProvider()
    private readonly provider: AlchemyProvider,
  ) {}

  async withPolygonConnection() {
    return await this.provider.detectNetwork();
  }
}
