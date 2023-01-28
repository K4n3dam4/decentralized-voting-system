import { ElectionCreateDto, VoterSignupDto } from '@dvs/api';

const {
  randCity,
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randPassword,
  randStreetAddress,
} = require('@ngneat/falso');
const axios = require('axios');
const os = require('os');

class TestScalability {
  baseURL = 'http://localhost:3000/api';
  voterList: VoterSignupDto[] = [];
  startTimeStamp: number;
  newElection: boolean;
  electionId: number;
  finished = false;
  breaks = 0;
  voters: number;
  tolerance: number;
  concurrent: boolean;

  constructor({ voters = 1, tolerance = 10, concurrent = false, election_id = 1, new_election = false }) {
    this.newElection = new_election;
    this.electionId = election_id;
    this.voters = voters;
    this.tolerance = tolerance;
    this.concurrent = concurrent;

    this.logger('Initializing scalability test with the following parameters:');
    this.logger(`Election ID: ${election_id}`);
    this.logger(`Number of voters: ${voters}`);
    this.logger(`Tolerance for failed votes: ${tolerance}`);
    this.logger(`Execute votes concurrently: ${concurrent}`);
    this.logger('');

    for (let i = 0; i < voters; i++) {
      this.voterList.push({
        ssn: randNumber({ max: 9, length: 9 }).join(''),
        firstName: randFirstName(),
        lastName: randLastName(),
        street: randStreetAddress(),
        postalCode: +randNumber({ max: 9, length: 5 }).join(''),
        city: randCity(),
        email: randEmail(),
        password: randPassword() + '@',
      });
    }
  }

  createHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

  logger = (message: string, voter?: Partial<VoterSignupDto>) =>
    process.stdout.write((voter ? `${voter.firstName} ${voter.lastName} ${message}` : message) + os.EOL);

  signupVoter = async (voter: VoterSignupDto) => {
    this.logger('signing up...', voter);
    try {
      await axios(`auth/signup`, { method: 'POST', baseURL: this.baseURL, data: voter });
    } catch (e) {
      this.logger(e);
    }
  };

  signin = async (email: string, password: string, voter?: Partial<VoterSignupDto>) => {
    this.logger('signing in...', voter);
    try {
      const { data } = await axios(`auth/signin`, { method: 'POST', baseURL: this.baseURL, data: { email, password } });
      return data.access_token;
    } catch (e) {
      this.logger(e);
    }
  };

  createElection = async (election: ElectionCreateDto, token: string) => {
    try {
      const { data } = await axios('admin/election/create', {
        method: 'POST',
        baseURL: this.baseURL,
        headers: this.createHeaders(token),
        data: election,
      });
      this.electionId = data.id;
    } catch (e) {
      this.logger(e);
    }
  };

  addEligibleVoters = async (token: string) => {
    try {
      await axios('admin/election/add/voter', {
        method: 'POST',
        baseURL: this.baseURL,
        headers: this.createHeaders(token),
        data: { eligibleVoters: this.voterList.map(({ ssn }) => ({ electionId: this.electionId, ssn })) },
      });
    } catch (e) {
      this.logger(e);
    }
  };

  registerVoter = async (voter: VoterSignupDto, token: string) => {
    this.logger('registering...', voter);
    try {
      const { data } = await axios(`election/register/${this.electionId}`, {
        method: 'POST',
        baseURL: this.baseURL,
        headers: this.createHeaders(token),
        data: { ssn: voter.ssn },
      });
      return data.mnemonic;
    } catch (e) {
      throw new Error(e.code);
    }
  };

  vote = async (voter: VoterSignupDto, token: string, mnemonic: string) => {
    this.logger('voting...', voter);
    try {
      await axios(`election/vote/${this.electionId}`, {
        method: 'POST',
        baseURL: this.baseURL,
        headers: this.createHeaders(token),
        data: { mnemonic, candidate: 0 },
      });
    } catch (e) {
      this.logger(e);
      throw new Error(e);
    }
  };

  run = async () => {
    const adminToken = await this.signin('admin@test.com', 'adminpw', { firstName: 'Admin', lastName: '' });

    if (this.newElection) {
      this.logger('Creating election...');
      const now = new Date();

      await this.createElection(
        {
          name: 'US Presidential Election 2020',
          image: 'https://google.de',
          candidates: [
            { name: 'Donald J. Trump', image: '', party: 'GOP' },
            { name: 'Joe Biden', image: '', party: 'Democrats' },
          ],
          description:
            'After both parties have chosen their respective candidates, the election process for the 2020 presidential election will commence on November, 3.',
          eligibleVoters: this.voterList.map((voter) => voter.ssn),
          expires: Math.round(now.setMonth(now.getMonth() + 12) / 1000),
        },
        adminToken,
      );

      this.logger('Election created successfully.');
    } else {
      await this.addEligibleVoters(adminToken);
    }

    if (this.electionId) {
      this.startTimeStamp = Date.now();

      const call = async (voter: VoterSignupDto) => {
        if (this.finished) return;

        await this.signupVoter(voter);

        const token = await this.signin(voter.email, voter.password, voter);

        try {
          const mnemonic = await this.registerVoter(voter, token);
          await this.vote(voter, token, mnemonic);
          this.logger('');
          this.logger('==========');
          this.logger('has voted', voter);
          this.logger('==========');
          this.logger('');
        } catch {
          this.logger('could not vote.', voter);
          this.breaks = this.breaks + 1;
          this.logger(`Failed votes total: ${this.breaks}`);
          this.logger('');

          if (this.breaks > this.tolerance) {
            throw new Error();
          }
        }
      };

      try {
        if (this.concurrent) {
          const voterCalls = this.voterList.map(call);
          await Promise.all(voterCalls);
        } else {
          for (const voter of this.voterList) {
            await call(voter);
          }
        }
      } catch {
        this.finished = true;
        this.logger(`Tolerance threshold of ${this.tolerance} unsuccessful votes reached.`);
        this.logger('Finishing test');
      } finally {
        if (!this.finished) {
          this.logger(`Scalability test completed.`);
          const seconds = (Date.now() - this.startTimeStamp) / 1000;
          const minutes = seconds / 60;
          const hours = minutes / 60;
          const months = hours / 24 / 30;
          this.logger(`${this.voters} voters voted in ${(Date.now() - this.startTimeStamp) / 1000} seconds.`);
          this.logger(`This equates to:`);
          this.logger(`- ${minutes} minutes`);
          this.logger(`- ${hours} hours`);
          this.logger(`- ${months} months`);
        }
      }
    } else {
      this.logger('Election contract could not be deployed.');
    }
  };
}

process.argv.splice(0, 2);
const args: { voters?: number; tolerance?: number; concurrent?: boolean } = process.argv.reduce((prev, curr) => {
  const splitArg = curr.split('=');
  if (/^-?\d+$/.test(splitArg[1])) {
    prev[splitArg[0].replace('--', '')] = Number(splitArg[1]);
  } else {
    prev[splitArg[0].replace('--', '')] = splitArg[1] === 'true';
  }
  return prev;
}, {});

const testScalability = new TestScalability(args);
testScalability.run();
