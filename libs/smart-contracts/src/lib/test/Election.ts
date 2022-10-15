import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Election } from '../typechain-types';
import { Wallet } from 'ethers';

describe('Test contracts', function () {
  describe('Election', function () {
    let election: Election;

    const ssn = 123456;
    let wallet: Wallet;

    beforeEach(async function () {
      // voter wallet
      wallet = await ethers.Wallet.createRandom();

      // contract
      const Election = await ethers.getContractFactory('Election');
      election = await Election.deploy();
    });

    describe('Deployment', function () {
      it('should be deployable', function () {
        expect(election.address).properAddress;
      });
    });

    describe('Administration', function () {
      const ssn = [123456, 123465];
      it('should add eligible voters', async function () {
        await election.addEligibleVoters(ssn);
        const bigNumbers = await election.getEligibleVoters();
        const eligibleSSN = bigNumbers.map((ssn) => ssn.toNumber());
        expect(eligibleSSN[0]).to.be.equal(ssn[0]);
      });

      it('should not add eligible voters twice', async function () {
        await election.addEligibleVoters(ssn);
        let error;
        try {
          await election.addEligibleVoters(ssn);
        } catch (e) {
          error = e;
        }
        expect(error).not.to.be.undefined;
      });

      it('should destroy contract', async function () {
        const res = await election.kill();
        expect(res.confirmations).to.be.greaterThan(0);
      });
    });

    describe('Voting', function () {
      it('should register voters', async function () {
        const res = await election.registerVoter(wallet.address, [ssn]);
        expect(res.confirmations).to.be.greaterThan(0);
      });

      it('should transfer funds', async function () {
        const res = await election.registerVoter(wallet.address, [ssn], {
          value: ethers.utils.parseEther('0.121434'),
        });
        expect(ethers.utils.formatEther(res.value)).to.be.equal('0.121434');
        // const gasPrice = await provider.getGasPrice();
        // const gasUnits = await electionInstance.estimateGas.registerVoter(wallet.address, [1]);
        // const transactionFee = gasPrice.mul(gasUnits);
        // console.log('transactionFee in wei: ' + transactionFee.toString());
        // console.log('transactionFee in ether: ' + ethers.utils.formatUnits(transactionFee, 'ether'));
      });
    });
  });
});
