import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Election } from '../typechain-types';
import { JsonRpcProvider } from '@ethersproject/providers';

describe('Test contracts', function () {
  describe('Election', function () {
    let election: Election;

    let wallet0: string, wallet1: string, provider: JsonRpcProvider;

    before(async function () {
      // provider
      provider = ethers.provider;
      // contract
      const Election = await ethers.getContractFactory('Election');
      const expiration = Math.floor((Date.now() / 1000) * 2);
      election = await Election.deploy('Presidential Election 2020', ['Biden', 'Trump'], expiration);
      // voter wallet
      const [address0, address1] = await provider.listAccounts();
      wallet0 = address0;
      wallet1 = address1;
    });

    describe('Deployment', function () {
      it('should be deployable', function () {
        expect(election.address).properAddress;
      });
    });

    describe('Administration', function () {
      it('should register voters', async function () {
        const res = await election.registerVoter(wallet0);
        expect(res.confirmations).to.be.greaterThan(0);
      });

      it('should not add eligible voters twice', async function () {
        await expect(election.registerVoter(wallet0)).to.be.revertedWith('voter.isAlreadyRegistered');
      });

      it('should transfer voting weight', async function () {
        const res = await election.addVotingWeight(wallet0);
        expect(res.confirmations).to.be.greaterThan(0);
        const voter = await election.getVoters(wallet0);
        expect(voter.weight).to.be.equal(1);
      });

      it('should transfer funds', async function () {
        const res = await election.registerVoter(wallet1, {
          value: ethers.utils.parseEther('0.121434'),
        });
        expect(ethers.utils.formatEther(res.value)).to.be.equal('0.121434');
        // const gasPrice = await provider.getGasPrice();
        // const gasUnits = await electionInstance.estimateGas.registerVoter(wallet.address, [1]);
        // const transactionFee = gasPrice.mul(gasUnits);
        // console.log('transactionFee in wei: ' + transactionFee.toString());
        // console.log('transactionFee in ether: ' + ethers.utils.formatUnits(transactionFee, 'ether'));
      });

      // it('should destroy contract', async function () {
      //   const res = await election.discardContract();
      //   expect(res.confirmations).to.be.greaterThan(0);
      // });
    });

    describe('Voting', function () {
      it('should prevent uneligible votes', async function () {
        const electionConnect = await election.connect(provider.getSigner(wallet1));
        await expect(electionConnect.vote(0)).to.be.revertedWith('voter.notEligible');
      });

      it('should register vote', async function () {
        const electionConnect = await election.connect(provider.getSigner(wallet0));
        await electionConnect.vote(0);
        const candidate = await electionConnect.candidates(0);
        expect(candidate.voteCount).to.equal(1);
      });

      it('should prevent double votes', async function () {
        const electionConnect = await election.connect(provider.getSigner(wallet0));
        await expect(electionConnect.vote(1)).revertedWith('voter.hasVoted');
      });
    });
  });
});
