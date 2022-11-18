import { workspaceRoot } from 'nx/src/utils/workspace-root';
import path from 'path';
import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { deployAndUpdate } from './src/lib/scripts/deploy';
import { getSignerFromMnemonic } from './src/lib/scripts/helpers';

task('dpl-election-test', 'deploys Election.sol to testnet')
  .addParam('name', 'election name')
  .addParam('candidates', 'election candidates (comma-separated)')
  .addParam('expiration', 'election expires on in (unix timestamp in seconds)')
  .setAction(async (taskArgs, hre) => {
    const env = '.env.local';
    const envTest = '.env.test';
    const file = path.resolve(workspaceRoot, env);
    const fileTest = path.resolve(workspaceRoot, envTest);

    taskArgs.candidates = taskArgs.candidates.split(',');
    taskArgs.expiration = Number(taskArgs.expiration);
    const args = Object.values(taskArgs);

    await deployAndUpdate(file, env, 'Election', hre, args, fileTest, envTest);
  });

task('dpl-election-main', 'deploys Election.sol to mainnet')
  .addParam('name', 'election name')
  .addParam('candidates', 'election candidates (comma-separated)')
  .addParam('expiration', 'election expires on in (unix timestamp in seconds)')
  .setAction(async (taskArgs, hre) => {
    const env = '.env';
    const file = path.resolve(workspaceRoot, env);

    taskArgs.candidates = taskArgs.candidates.split(',');
    taskArgs.expiration = Number(taskArgs.expiration);
    const args = Object.values(taskArgs);

    await deployAndUpdate(file, env, 'Election', hre, args);
  });

task('get-signer', 'gets signer from mnemonic')
  .addParam('mnemonic', 'mnemonic passphrase (comma-seperated)')
  .setAction(async (taskArgs, hre) => {
    const mnemonic = taskArgs.mnemonic.split(',').join(' ');
    getSignerFromMnemonic(mnemonic, hre);
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
