import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Election } from '../typechain-types';
import { JsonRpcProvider } from '@ethersproject/providers';

describe('Test contracts', function () {
  describe('Election', function () {
    let election: Election;

    let owner: string, wallet0: string, wallet1: string, provider: JsonRpcProvider;

    before(async function () {
      // provider
      provider = ethers.provider;
      // wallets
      const [ownerAddress, address0, address1] = await provider.listAccounts();
      owner = ownerAddress;
      wallet0 = address0;
      wallet1 = address1;

      // contract
      const Election = await ethers.getContractFactory('Election', { signer: provider.getSigner(owner) });
      const expiration = Math.floor((Date.now() / 1000) * 2);
      election = await Election.deploy('Presidential Election 2020', ['Joe Biden', 'Donald J. Trump'], expiration);
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
        await expect(election.registerVoter(wallet0)).to.be.revertedWith('error.contract.isAlreadyRegistered');
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
      });
    });

    describe('Voting', function () {
      it('should prevent uneligible votes', async function () {
        const electionConnect = election.connect(provider.getSigner(wallet1));
        await expect(electionConnect.vote(0)).to.be.revertedWith('error.contract.uneligible');
      });

      it('should vote', async function () {
        const electionConnect = await election.connect(provider.getSigner(wallet0));
        const res = await electionConnect.vote(0);
        expect(res.confirmations).to.be.greaterThan(0);
      });

      it('should prevent double votes', async function () {
        const electionConnect = await election.connect(provider.getSigner(wallet0));
        await expect(electionConnect.vote(1)).to.be.revertedWith('error.contract.hasVoted');
      });
    });

    describe('Results', function () {
      it('should close election', async function () {
        const res = await election.closeElection();
        expect(res.confirmations).to.be.greaterThan(0);
      });

      it('should calculate results', async function () {
        const res = await election.calcResult();
        expect(res.confirmations).to.be.greaterThan(0);
      });

      it('should have correct results', async function () {
        const results = await election.getResults();
        expect(results[0].voteCount).to.be.equal(1);
      });
    });
  });
});
