import { ethers } from 'hardhat';

async function main() {
  const Voter = await ethers.getContractFactory('Voter');
  const voter = await Voter.deploy();

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const timestamp = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  await voter.deployed();
  console.log(`Voter deployed to ${voter.address} with timestamp ${timestamp}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
