import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthModule,
  CoreModule,
  ElectionCreateDto,
  ElectionModule,
  ElectionRegisterDto,
  ElectionVoteDto,
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
      describe('Signup voter', function () {
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
      describe('Signin voter', function () {
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

      describe('Signin admin', function () {
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

    // Test elections module
    describe('Elections', function () {
      const headersVoter = { Authorization: 'Bearer $S{access_tokenV}' };
      const headersAdmin = { Authorization: 'Bearer $S{access_tokenA}' };

      const baseUrl = 'election/';

      describe('Create election', function () {
        const dto: ElectionCreateDto = {
          name: 'US Presidential Election 2020',
          image: 'https://google.de',
          candidates: [
            { name: 'Donald J. Trump', image: '', party: 'GOP' },
            { name: 'Joe Biden', image: '', party: 'Democrats' },
          ],
          description:
            'After both parties have chosen their respective candidates, the election process for the 2021 presidential election will commence on November, 3.',
          eligibleVoters: [mockVoter.ssn, process.env.VOTER_ADDRESS],
          expires: 1677625200,
        };
        const url = baseUrl + 'create';

        it('should be guarded', function () {
          return spec().post(url).withHeaders(headersVoter).expectStatus(403);
        });

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.name = '';
          return spec().post(url).withHeaders(headersAdmin).withBody(faultyDto).expectStatus(400);
        });

        it('should create election', function () {
          return spec().post(url).withHeaders(headersAdmin).withBody(dto).expectStatus(201).stores('ElectionId', 'id');
        });
      });

      describe('Get all', function () {
        const url = baseUrl + 'all';

        it('should be guarded', function () {
          return spec().get(url).expectStatus(401);
        });

        it('should get all elections', function () {
          return spec().get(url).withHeaders(headersVoter).expectStatus(200);
        });
      });

      describe('Get single', function () {
        const url = baseUrl + 'single/';

        it('should be guarded', function () {
          return spec()
            .get(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .expectStatus(401);
        });

        it('should get single election', function () {
          return spec()
            .get(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .expectStatus(200);
        });
      });

      describe('Register voter', function () {
        const dto: ElectionRegisterDto = {
          ssn: mockVoter.ssn,
        };
        const url = baseUrl + 'register/';

        it('should be guarded', function () {
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should throw not found error', function () {
          return spec()
            .post(url + '2403490')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(404);
        });

        it('should not register uneligible voters', function () {
          const faultyDto = { ...dto };
          faultyDto.ssn = '2134';
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectStatus(403);
        });

        it('should register eligible voters', function () {
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(201)
            .stores('Mnemonic', 'mnemonic');
        });
      });

      describe('Vote', function () {
        const dto: ElectionVoteDto = {
          mnemonic: '$S{Mnemonic}',
          candidate: 0,
        };
        const url = baseUrl + 'vote/';

        it('should be guarded', function () {
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withBody(dto)
            .expectStatus(401);
        });

        it('should throw not found error', function () {
          return spec()
            .post(url + '2403490')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(404);
        });

        it('should throw not registered error', function () {
          const faultyDto = { ...dto };
          faultyDto.mnemonic =
            'town sun north elevator rubber crack dolphin runway liar awake try iron crew relief basic';
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectStatus(403);
        });

        it('should throw voter.notEligible', function () {
          const faultyDto = { ...dto };
          faultyDto.mnemonic = process.env.VOTER_MNEMONIC;
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(faultyDto)
            .expectBody({ message: 'voter.notEligible', statusCode: 403 });
        });

        it('should vote', function () {
          return spec()
            .post(url + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody(dto)
            .expectStatus(201);
        });
      });
    });
  });
});
