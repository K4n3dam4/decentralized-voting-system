import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule, CoreModule, ElectionModule, VoterSignin, VoterSignup } from '@dvs/api';
import { Admin, PrismaModule, PrismaService } from '@dvs/prisma';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppModule } from '@dvs/server';
import { request, spec } from 'pactum';

describe('App e2e', () => {
  describe('e2e running...', () => {
    let app: INestApplication;
    let core: CoreModule;
    let prisma: PrismaService;
    const host = 'http://localhost:3333/api/';

    // test users and data
    const admin: Admin = {
      firstName: 'Test',
      lastName: 'Admin',
      serviceNumber: 987654,
    };
    const mockVoter: VoterSignup = {
      socialSecurity: '123456',
      firstName: 'John',
      lastName: 'Doe',
      street: 'Baker Street 1',
      postalCode: 20095,
      city: 'Web3 City',
      email: 'johndoe@test.com',
      password: 'testpassword',
    };

    beforeAll(async () => {
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

      it('should establish Polygon network connection', async function () {
        const network = await core.withPolygonConnection();
        const expectedNetwork = 'maticmum';
        expect(network.name).toEqual(expectedNetwork);
      });
    });

    // Test auth module
    describe('Auth', function () {
      describe('Signup', function () {
        const dto = { ...mockVoter };

        const url = 'auth/signup';

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
          duplicateEmail.socialSecurity = '1357810';
          return spec().post(url).withBody(duplicateEmail).expectStatus(403);
        });

        it('should not allow duplicate social security number', function () {
          const duplicateSocialNumber = { ...dto };
          duplicateSocialNumber.email = 'johndoe2@test.com';
          return spec().post(url).withBody(duplicateSocialNumber).expectStatus(403);
        });
      });
      describe('Signin', function () {
        const dto: VoterSignin = {
          email: mockVoter.email,
          password: mockVoter.password,
        };
        const url = 'auth/signin';

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.password = '';
          return spec()
            .post(url)
            .withBody(faultyDto)
            .expectBody({ statusCode: 400, message: ['password should not be empty'], error: 'Bad Request' });
        });

        it('should validate username', function () {
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
          return spec().post(url).withBody(dto).expectStatus(200).stores('access_token', 'access_token');
        });
      });
    });

    // Test elections module
    describe('Elections', function () {
      const headers = { Authorization: 'Bearer $S{access_token}' };

      describe('Get all', function () {
        const url = 'election/get/all';

        it('should be guarded', function () {
          return spec().get(url).expectStatus(401);
        });

        it('should get all elections', function () {
          return spec().get(url).withHeaders(headers).expectStatus(200);
        });
      });

      describe('Get single', function () {
        const url = 'election/get/1';

        it('should be guarded', function () {
          return spec().get(url).expectStatus(401);
        });
      });
    });
  });
});
