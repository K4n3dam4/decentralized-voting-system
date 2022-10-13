import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule, CoreModule, VoterSignin, VoterSignup } from '@dvs/api';
import { Admin, PrismaModule, PrismaService, RegisteredVoter } from '@dvs/prisma';
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
      employeeNumber: 987654,
    };

    const registeredVoter0: RegisteredVoter = {
      socialSecurity: 123456,
      firstName: 'Test',
      lastName: 'User 0',
      street: 'Street 1',
      postalCode: 32432,
      city: 'City',
      hasRegistered: false,
    };

    const registeredVoter1: RegisteredVoter = {
      socialSecurity: 654321,
      firstName: 'Test',
      lastName: 'User 1',
      street: 'Street 1',
      postalCode: 32432,
      city: 'City',
      hasRegistered: false,
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
      await prisma.withRegisteredVoter(registeredVoter0);
      await prisma.withRegisteredVoter(registeredVoter1);
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

      it('should load configuration', function () {
        const config = core.withConfig();
        const environment = config.get('environment');
        const port = config.get('port');
        expect(environment).toEqual(process.env.NODE_ENV);
        expect(port).toBe(3000);
      });

      it('should establish Polygon network connection', async function () {
        const network = await core.withPolygonConnection();
        const environment = core.withConfig().get('environment');
        const expectedNetwork = environment === 'production' ? 'matic' : 'maticmum';
        expect(network.name).toEqual(expectedNetwork);
      });
    });

    // Test auth module
    describe('Auth', function () {
      describe('Signup', function () {
        const dto: VoterSignup = {
          socialSecurity: registeredVoter0.socialSecurity,
          username: 'Test User',
          password: 'testuserpassword',
        };

        const url = 'auth/signup';

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.password = '';
          return spec()
            .post(url)
            .withBody(faultyDto)
            .expectBody({ statusCode: 400, message: ['password should not be empty'], error: 'Bad Request' });
        });

        it('should only sign up registered voters', function () {
          const unregisteredVoter = { ...dto };
          unregisteredVoter.socialSecurity = 4378273842;
          return spec().post(url).withBody(unregisteredVoter).expectStatus(403);
        });

        it('should sign up', function () {
          return spec().post(url).withBody(dto).expectStatus(201);
        });

        it('should only sign up once', function () {
          return spec().post(url).withBody(dto).expectStatus(403);
        });

        it('should not allow duplicate usernames', function () {
          const duplicateUsername = { ...dto };
          duplicateUsername.socialSecurity = registeredVoter1.socialSecurity;
          return spec().post(url).withBody(duplicateUsername).expectStatus(403);
        });
      });
      describe('Signin', function () {
        const dto: VoterSignin = {
          username: 'Test User',
          password: 'testuserpassword',
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
          faultyDto.username = 'Test';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should validate password', function () {
          const faultyDto = { ...dto };
          faultyDto.username = 'ewffrefr';
          return spec().post(url).withBody(faultyDto).expectStatus(403);
        });

        it('should sign in', function () {
          return spec().post(url).withBody(dto).expectStatus(200);
        });
      });
    });
  });
});
