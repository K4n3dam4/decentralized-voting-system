import { HardhatRuntimeEnvironment } from 'hardhat/types';
import contractMap from './contractMap';
import fs from 'fs-extra';

export async function deploy(contract: string, hre: HardhatRuntimeEnvironment, args: any[] = []) {
  const contractFactory = await hre.ethers.getContractFactory(contract);
  const deployedContract = await contractFactory.deploy(...args);

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const timestamp = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  console.log(`Deploying contract ${contract}...`);
  await deployedContract.deployed();
  console.log(`${contract} deployed to ${deployedContract.address} with timestamp ${timestamp}`);
  return deployedContract.address;
}

export async function deployAndUpdate(
  file: string,
  env: string,
  contract: string,
  hre: HardhatRuntimeEnvironment,
  args: any[] = [],
  fileTest?: string,
  envTest?: string,
) {
  let data = await fs.readFile(file, 'utf-8');
  let dataTest;

  if (fileTest) {
    dataTest = await fs.readFile(fileTest, 'utf-8');
  }

  const contractKey = contract.toUpperCase();
  const contractValue = contractMap[contract];

  try {
    const address = await deploy(contract, hre, args);

    if (address) {
      data = data.replace(`${contractKey}=${contractValue}`, `${contractKey}=${address}`);

      if (dataTest) {
        dataTest = dataTest.replace(`${contractKey}=${contractValue}`, `${contractKey}=${address}`);
      }

      console.log(`Updating ${env} with new addresses...`);
      await fs.writeFile(file, data);
      console.log(`${env} updated`);

      if (fileTest && dataTest) {
        console.log(`Updating ${envTest} with new addresses...`);
        await fs.writeFile(fileTest, dataTest);
        console.log(`${envTest} updated`);
      }
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    console.log(`Could not deploy ${contract}`);
  }
}
