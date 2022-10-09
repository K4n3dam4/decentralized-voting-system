import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    testnet: {
      url: process.env.ALCHEMY_API,
      accounts: [`0x${process.env.ADMIN_PK}`],
    },
  },
  paths: {
    root: './src/lib/',
  },
};

export default config;
