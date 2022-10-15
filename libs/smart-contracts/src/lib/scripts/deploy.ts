import { HardhatRuntimeEnvironment } from 'hardhat/types';
import contractMap from './contractMap';
import fs from 'fs-extra';

async function deploy(contract: string, hre: HardhatRuntimeEnvironment) {
  const contractFactory = await hre.ethers.getContractFactory(contract);
  const deployedContract = await contractFactory.deploy();

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const timestamp = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  console.log(`Deploying contract ${contract}...`);
  await deployedContract.deployed();
  console.log(`${contract} deployed to ${deployedContract.address} with timestamp ${timestamp}`);
  return deployedContract.address;
}

export async function deployAndUpdate(file: string, env: string, hre: HardhatRuntimeEnvironment) {
  const contracts = contractMap;
  let data = await fs.readFile(file, 'utf-8');

  // loop through contracts, deploy and update env
  for (const entry of Object.entries(contracts)) {
    const [key, value] = entry;
    let contract = key.split('_')[1].toLowerCase();
    contract = contract.charAt(0).toUpperCase() + contract.slice(1);
    try {
      const address = await deploy(contract, hre);
      data = data.replace(`${key}=${value}`, `${key}=${address}`);
    } catch (err) {
      console.log(`Error: ${err}`);
      console.log(`Could not deploy ${contract}`);
    }
  }
  console.log(`Updating ${env} with new addresses...`);
  await fs.writeFile(file, data);
  console.log(`${env} updated`);
}
