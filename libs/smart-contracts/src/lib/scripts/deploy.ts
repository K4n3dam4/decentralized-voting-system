import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function main(contract: string, hre: HardhatRuntimeEnvironment) {
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
