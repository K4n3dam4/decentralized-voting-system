import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  paths: {
    root: './src/lib/',
  },
};

export default config;
