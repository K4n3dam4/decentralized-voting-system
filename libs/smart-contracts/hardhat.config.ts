import { workspaceRoot } from 'nx/src/utils/workspace-root';
import path from 'path';
import fs from 'fs-extra';
import { HardhatUserConfig, task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import contractMap from './src/lib/scripts/contractMap';
import main from './src/lib/scripts/deploy';

const deployAndUpdate = async (file: string, env: string, hre: HardhatRuntimeEnvironment) => {
  const contracts = contractMap;
  let data = await fs.readFile(file, 'utf-8');

  // loop through contracts, deploy and update env
  for (const entry of Object.entries(contracts)) {
    const [key, value] = entry;
    let contract = key.split('_')[1].toLowerCase();
    contract = contract.charAt(0).toUpperCase() + contract.slice(1);
    try {
      const address = await main(contract, hre);
      data = data.replace(`${key}=${value}`, `${key}=${address}`);
    } catch (err) {
      console.log(`Error: ${err}`);
      console.log(`Could not deploy ${contract}`);
    }
  }
  console.log(`Updating ${env} with new addresses...`);
  await fs.writeFile(file, data);
  console.log(`${env} updated`);
};

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
