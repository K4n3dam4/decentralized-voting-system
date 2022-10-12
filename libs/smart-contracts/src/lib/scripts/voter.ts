import { ethers } from 'hardhat';
import '@nomiclabs/hardhat-ethers';
import { Voter__factory } from '../typechain-types';

export class VoterController {
  private address = '';
  private abi = Voter__factory.abi;
  private alchemy = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_API_KEY);
  private adminWallet = new ethers.Wallet(process.env.ADMIN_PK as string, this.alchemy);
  private Contract = new ethers.Contract(this.address, this.abi, this.adminWallet);

  constructor(address: string) {
    this.address = address;
  }

  async kill() {
    await this.Contract.functions.kill();
  }
}
