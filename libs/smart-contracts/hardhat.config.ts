import { workspaceRoot } from 'nx/src/utils/workspace-root';
import path from 'path';
import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { deployAndUpdate } from './src/lib/scripts/deploy';

task('deploy-testnet', 'deploys contracts to testnet').setAction(async (_taskArgs, hre) => {
  const env = '.env.local';
  const file = path.resolve(workspaceRoot, env);
  await deployAndUpdate(file, env, hre);
});

task('deploy-mainnet', 'deploys contracts to mainnet').setAction(async (_taskArgs, hre) => {
  const env = '.env';
  const file = path.resolve(workspaceRoot, env);
  await deployAndUpdate(file, env, hre);
});

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    testnet: {
      url: process.env.ALCHEMY_API,
      accounts: [`0x${process.env.ADMIN_PK}`],
    },
    mainnet: {
      url: process.env.ALCHEMY_API_MAIN,
      accounts: [`0x${process.env.ADMIN_PK_MAIN}`],
    },
  },
  paths: {
    root: './src/lib/',
  },
};

export default config;
