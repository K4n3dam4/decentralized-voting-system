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
  voterNumber: number;
  tolerance: number;
  startTimeStamp: number;
  electionId: number;
  breaks: number;

  constructor(voterNumber = 1, tolerance = 10) {
    this.voterNumber = voterNumber;
    this.tolerance = tolerance;

    for (let i = 0; i < voterNumber; i++) {
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

  logger = (message: string, voter?: VoterSignupDto) =>
    process.stdout.write((voter ? `${voter.firstName} ${voter.lastName} ${message}` : message) + os.EOL);

  signupVoter = async (voter: VoterSignupDto) => {
    this.logger('signing up...', voter);
    try {
      await axios(`auth/signup`, { method: 'POST', baseURL: this.baseURL, data: voter });
    } catch (e) {
      this.logger(e);
    }
  };

  signin = async (email: string, password: string, voter?: VoterSignupDto) => {
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
      this.logger(e);
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
      return true;
    } catch (e) {
      this.logger(e);
      return e;
    }
  };

  run = async () => {
    const adminToken = await this.signin('admin@test.com', 'adminpw');
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
        expires: Math.round(new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() / 1000),
      },
      adminToken,
    );

    if (this.electionId) {
      this.startTimeStamp = Date.now();
      const call = async (voter: VoterSignupDto) => {
        await this.signupVoter(voter);

        console.log(voter);

        const token = await this.signin(voter.email, voter.password, voter);
        const mnemonic = await this.registerVoter(voter, token);

        const voted = await this.vote(voter, token, mnemonic);
        if (!voted) {
          this.logger('could not vote.', voter);
          this.breaks = this.breaks + 1;

          if (this.breaks > this.tolerance) {
            this.logger(`More than ${this.tolerance} unsuccessful voters.`);
            this.logger('Finishing test');
            throw Error();
          }
        }
      };

      try {
        const voterCalls = this.voterList.map(call);
        await Promise.all(voterCalls);
      } finally {
        this.logger(`Scalability test completed.`);
        this.logger(`${this.voterNumber} voter voted in ${(Date.now() - this.startTimeStamp) / 1000} seconds`);
      }
    } else {
      this.logger('Election contract could not be deployed.');
    }
  };
}

process.argv.splice(0, 2);
const args = process.argv.map((arg) => Number(arg.split('=')[1]));

const testScalability = new TestScalability(...args);
testScalability.run();
