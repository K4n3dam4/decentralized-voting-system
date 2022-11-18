import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthModule,
  CoreModule,
  ElectionCreateDto,
  ElectionEligibleDto,
  ElectionModule,
  ElectionRegisterDto,
  ElectionVoteDto,
  EligibleCreateDto,
  EligibleDeleteDto,
  EligibleUpdateDto,
  SigninDto,
  VoterSignupDto,
} from '@dvs/api';
import { AdminDto, PrismaModule, PrismaService } from '@dvs/prisma';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppModule } from '@dvs/server';
import { request, spec } from 'pactum';
import * as argon from 'argon2';

describe('App e2e', () => {
  describe('e2e running...', () => {
    let app: INestApplication;
    let core: CoreModule;
    let prisma: PrismaService;
    const host = 'http://localhost:3333/api/';

    // test users and data
    const admin: AdminDto = {
      firstName: 'Test',
      lastName: 'Admin',
      street: 'Baker Street 2',
      postalCode: 20095,
      city: 'Web3 City',
      email: 'admin@test.com',
      serviceNumber: 987654,
      hash: 'adminpw',
    };
    const mockVoter: VoterSignupDto = {
      ssn: '123456',
      firstName: 'John',
      lastName: 'Doe',
      street: 'Baker Street 1',
      postalCode: 20095,
      city: 'Web3 City',
      email: 'johndoe@test.com',
      password: 'testpassword',
    };
    const mockVoter2: VoterSignupDto = {
      ssn: '654321',
      firstName: 'Jane',
      lastName: 'Doe',
      street: 'Baker Street 2',
      postalCode: 20095,
      city: 'Web3 City',
      email: 'johndoe2@test.com',
      password: 'testpassword',
    };

    beforeAll(async () => {
      // admin
      admin.hash = await argon.hash(admin.hash);

      // app
      const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
      app = moduleFixture.createNestApplication();
      app.setGlobalPrefix('api');
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      await app.init();
      await app.listen(3333);

      // pactum
      request.setBaseUrl(host);
      request.setDefaultTimeout(100000);

      // core
      core = moduleFixture.get(CoreModule);
      // prisma
      prisma = app.get(PrismaService);
      await prisma.withCleanDatabase();
      await prisma.withAdmin(admin);
    });

    afterAll(function () {
      app.close();
    });

    // Test server setup
    describe('Server', function () {
      it('should be running', async function () {
        expect(await app.getHttpServer()).toBeDefined();
      });

      it('should load CoreModule', function () {
        expect(app.get(CoreModule)).toBeDefined();
      });

      it('should load PrismaModule', function () {
        expect(app.get(PrismaModule)).toBeDefined();
      });

      it('should load AuthModule', function () {
        expect(app.get(AuthModule)).toBeDefined();
      });

      it('should load AdminModule', function () {
        expect(app.get(AuthModule)).toBeDefined();
      });

      it('should load ElectionModule', function () {
        expect(app.get(ElectionModule)).toBeDefined();
      });

      it('should establish blockchain network connection', async function () {
        const network = await core.withPolygonConnection();
        const expectedNetwork = 'ganache';
        expect(network.name).toEqual(expectedNetwork);
      });
    });

    // Test auth module
    describe('Auth', function () {
      const baseUrl = 'auth/';
      // Signup voter
      describe('Signup voter [POST auth/signup]', function () {
        const dto = { ...mockVoter };

        const url = baseUrl + 'signup';

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.email = '';
          return spec().post(url).withBody(faultyDto).expectStatus(400);
        });

        it('should sign up', function () {
          return spec().post(url).withBody(dto).expectStatus(201);
        });

        it('should only sign up once', function () {
          return spec().post(url).withBody(dto).expectStatus(403);
        });

        it('should not allow duplicate emails', function () {
          const duplicateEmail = { ...dto };
          duplicateEmail.ssn = '1357810';
          return spec().post(url).withBody(duplicateEmail).expectStatus(403);
        });

        it('should not allow duplicate social security number', function () {
          const duplicateSocialNumber = { ...dto };
          duplicateSocialNumber.email = 'johndoe2@test.com';
          return spec().post(url).withBody(duplicateSocialNumber).expectStatus(403);
        });
      });

      // Signin voter
      describe('Signin voter [POST auth/signin]', function () {
        const dto: SigninDto = {
          email: mockVoter.email,
          password: mockVoter.password,
        };
        const url = baseUrl + 'signin';

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.password = '';
          return spec()
            .post(url)
            .withBody(faultyDto)
            .expectBody({ statusCode: 400, message: ['password should not be empty'], error: 'Bad Request' });
        });

        it('should validate email', function () {
          const faultyDto = { ...dto };
          faultyDto.email = 'john.doe@test.de';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should validate password', function () {
          const faultyDto = { ...dto };
          faultyDto.password = 'ewffrefr';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should sign in', async function () {
          return spec().post(url).withBody(dto).expectStatus(200).stores('access_tokenV', 'access_token');
        });
      });

      describe('Signin admin [POST auth/signin]', function () {
        const dto: SigninDto = {
          email: admin.email,
          password: admin.hash,
        };
        const url = baseUrl + 'signin';

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.password = '';

          return spec()
            .post(url)
            .withBody(faultyDto)
            .expectBody({ statusCode: 400, message: ['password should not be empty'], error: 'Bad Request' });
        });

        it('should validate email', function () {
          const faultyDto = { ...dto };
          faultyDto.email = 'eweoifwjie@dskm.de';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should validate password', function () {
          const faultyDto = { ...dto };
          faultyDto.password = 'ewffrefr';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should sign in', async function () {
          return spec().post(url).withBody(dto).expectStatus(200).stores('access_tokenA', 'access_token');
        });
      });
    });

    // Test admin module
    describe('Admin', function () {
      const headersAdmin = { Authorization: 'Bearer $S{access_tokenA}' };
      const headersVoter = { Authorization: 'Bearer $S{access_tokenV}' };
      const baseUrl = 'admin/';

      describe('Election', function () {
        const electionUrl = baseUrl + 'election/';

        const createUrl = electionUrl + 'create';
        const getAllUrl = electionUrl + 'all';
        const getSingleUrl = electionUrl + 'single/';
        const addVoterUrl = electionUrl + 'add/voter';
        const updateVoterUrl = electionUrl + 'update/voter/';
        const deleteVoterUrl = electionUrl + 'delete/voter';

        describe(`Create election [POST ${createUrl}]`, function () {
          const dto: ElectionCreateDto = {
            name: 'US Presidential Election 2020',
            image: 'https://google.de',
            candidates: [
              { name: 'Donald J. Trump', image: '', party: 'GOP' },
              { name: 'Joe Biden', image: '', party: 'Democrats' },
            ],
            description:
              'After both parties have chosen their respective candidates, the election process for the 2020 presidential election will commence on November, 3.',
            eligibleVoters: [mockVoter.ssn, mockVoter2.ssn],
            expires: Math.round(new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() / 1000),
          };

          it('should be guarded', function () {
            return spec().post(createUrl).withHeaders(headersVoter).expectStatus(403);
          });

          it('should validate request', function () {
            const faultyDto = { ...dto };
            faultyDto.name = '';
            return spec().post(createUrl).withHeaders(headersAdmin).withBody(faultyDto).expectStatus(400);
          });

          it('should create election', async function () {
            return spec()
              .post(createUrl)
              .withHeaders(headersAdmin)
              .withBody(dto)
              .expectStatus(201)
              .stores('ElectionId', 'id');
          });
        });

        describe(`Get all [GET ${getAllUrl}]`, function () {
          it('should be guarded', function () {
            return spec().get(getAllUrl).withHeaders(headersVoter).expectStatus(403);
          });

          it('should get all elections', function () {
            return spec().get(getAllUrl).withHeaders(headersAdmin).expectStatus(200);
          });
        });

        describe(`Get single [POST ${getSingleUrl}:id]`, function () {
          it('should be guarded', function () {
            return spec()
              .get(getSingleUrl + '{id}')
              .withPathParams('id', '$S{ElectionId}')
              .withHeaders(headersVoter)
              .expectStatus(403);
          });

          it('should get single election', function () {
            return spec()
              .get(getSingleUrl + '{id}')
              .withPathParams('id', '$S{ElectionId}')
              .withHeaders(headersAdmin)
              .expectStatus(200);
          });
        });

        describe(`Add eligible voters [POST ${addVoterUrl}]`, function () {
          let dto: EligibleCreateDto;
          beforeAll(async () => {
            prisma = app.get(PrismaService);
            const res = await prisma.getEligibleVoter();
            const { electionId } = res[0];
            dto = {
              eligibleVoters: [
                { electionId, ssn: '34435984943' },
                { electionId, ssn: '34293200293' },
              ],
            };
          });

          it('should be guarded', function () {
            return spec().post(addVoterUrl).withHeaders(headersVoter).withBody(dto).expectStatus(403);
          });

          it('should validate request', function () {
            const faultyDto: EligibleCreateDto = {
              eligibleVoters: [{ ...dto.eligibleVoters[0] }],
            };
            faultyDto.eligibleVoters[0].ssn = '';
            return spec().post(addVoterUrl).withHeaders(headersAdmin).withBody(faultyDto).expectStatus(400);
          });

          it('should add eligible voters', function () {
            return spec()
              .post(addVoterUrl)
              .withHeaders(headersAdmin)
              .withPathParams('id', '$S{ElectionId}')
              .withBody(dto)
              .expectStatus(201);
          });
        });

        describe(`Update eligible voter [PUT ${updateVoterUrl}:id]`, function () {
          let eligibleId: number;

          beforeAll(async () => {
            prisma = app.get(PrismaService);
            const res = await prisma.getEligibleVoter();
            const { id } = res.find(({ ssn }) => ssn === mockVoter2.ssn);
            eligibleId = id;
          });

          const dto: EligibleUpdateDto = {
            ssn: undefined,
            wallet: process.env.VOTER_ADDRESS,
          };

          it('should be guarded', function () {
            return spec()
              .put(updateVoterUrl + '{id}')
              .withPathParams('id', `${eligibleId}`)
              .withHeaders(headersVoter)
              .expectStatus(403);
          });

          it('should validate request', function () {
            const faultyDto = { wallet: 42332 };
            return spec()
              .put(updateVoterUrl + '{id}')
              .withPathParams('id', `${eligibleId}`)
              .withHeaders(headersAdmin)
              .withBody(faultyDto)
              .expectStatus(400);
          });

          it('should update eligible voter', function () {
            return spec()
              .put(updateVoterUrl + '{id}')
              .withPathParams('id', `${eligibleId}`)
              .withHeaders(headersAdmin)
              .withBody(dto)
              .expectStatus(200);
          });
        });

        describe(`Delete eligible voters [DELETE ${deleteVoterUrl}]`, function () {
          let dto: EligibleDeleteDto;
          beforeAll(async () => {
            prisma = app.get(PrismaService);
            const res = await prisma.getEligibleVoter();
            const { id } = res.find(({ ssn }) => ssn !== mockVoter.ssn && ssn !== mockVoter2.ssn);
            dto = {
              ids: [id],
            };
          });

          it('should be guarded', function () {
            return spec().delete(deleteVoterUrl).withHeaders(headersVoter).expectStatus(403);
          });

          it('should validate request', function () {
            const faultyDto = { ids: [''] };
            return spec().delete(deleteVoterUrl).withHeaders(headersAdmin).withBody(faultyDto).expectStatus(400);
          });

          it('should update eligible voter', function () {
            return spec().delete(deleteVoterUrl).withHeaders(headersAdmin).withBody(dto).expectStatus(200);
          });
        });
      });
    });

    // Test elections module
    describe('Election', function () {
      const headersVoter = { Authorization: 'Bearer $S{access_tokenV}' };
      const baseUrl = 'election/';

      const getALlUrl = baseUrl + 'all';
      const getSingleUrl = baseUrl + 'single/';
      const registerUrl = baseUrl + 'register/';
      const eligibleUrl = baseUrl + 'eligible/';
      const voteUrl = baseUrl + 'vote/';

      describe(`Get all [GET ${getALlUrl}]`, function () {
        it('should be guarded', function () {
          return spec().get(getALlUrl).expectStatus(401);
        });

        it('should get all elections', function () {
          return spec().get(getALlUrl).withHeaders(headersVoter).expectStatus(200);
        });
      });

      describe(`Get single [POST ${getSingleUrl}:id]`, function () {
        it('should be guarded', function () {
          return spec()
            .get(getSingleUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .expectStatus(401);
        });

        it('should get single election', function () {
          return spec()
            .get(getSingleUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .expectStatus(200);
        });
      });

      describe('Register voter [POST election/register]', function () {
        const dto: ElectionRegisterDto = {
          ssn: mockVoter.ssn,
        };

        it('should be guarded', function () {
          return spec()
            .post(registerUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should not register uneligible voters', function () {
          const faultyDto = { ...dto };
          faultyDto.ssn = '2134';
          return spec()
            .post(registerUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectStatus(403);
        });

        it('should register eligible voters', function () {
          return spec()
            .post(registerUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(201)
            .stores('Mnemonic', 'mnemonic');
        });
      });

      describe(`Check eligibility [POST ${eligibleUrl}:id]`, function () {
        const dto: ElectionEligibleDto = {
          mnemonic: '$S{Mnemonic}',
        };

        it('should be guarded', function () {
          return spec()
            .post(eligibleUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should throw invalid mnemonic error', function () {
          const faultyDto = {
            mnemonic: 'weijeko dowkedko',
          };
          return spec()
            .post(eligibleUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectStatus(400);
        });

        it('should validate mnemonic', function () {
          return spec()
            .post(eligibleUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(200);
        });
      });

      describe(`Vote [POST ${voteUrl}:id]`, function () {
        const dto: ElectionVoteDto = {
          mnemonic: '$S{Mnemonic}',
          candidate: 0,
        };

        it('should be guarded', function () {
          return spec()
            .post(voteUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should throw not registered error', function () {
          const faultyDto = { ...dto };
          faultyDto.mnemonic =
            'town sun north elevator rubber crack dolphin runway liar awake try iron crew relief basic';
          return spec()
            .post(voteUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectStatus(403);
        });

        it('should vote', function () {
          return spec()
            .post(voteUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(201);
        });

        it('should only allow one vote', function () {
          return spec()
            .post(voteUrl + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(403);
        });
      });
    });
  });
});
