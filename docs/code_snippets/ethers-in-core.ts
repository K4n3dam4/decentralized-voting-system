EthersCoreModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const environment = config.get('environment');
    // networks to connect
    const network: { [k: string]: string | Network } = {
      test: {
        name: 'ganache',
        chainId: 1337,
      },
      development: 'maticmum',
      production: 'matic',
    };

    // connection options
    const options: EthersModuleOptions = {
      network: network[environment],
      waitUntilIsConnected: true,
      useDefaultProvider: false,
      alchemy: config.get('alchemyAPIKey'),
    };

    // configure test environment options
    if (environment === 'test') {
      delete options.alchemy;
      options.custom = 'http://127.0.0.1:8545';
    }

    return options;
  },
});
