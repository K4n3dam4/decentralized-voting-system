import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule, CoreModule, VoterSignup } from '@dvs/api';
import { PrismaModule, PrismaService } from '@dvs/prisma';
import { AppModule } from '@dvs/server';
import { request, spec } from 'pactum';

describe('App e2e', () => {
  describe('e2e running...', () => {
    let app: INestApplication;
    let core: CoreModule;
    let prisma: PrismaService;
    const host = 'http://localhost:3333/api/';

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
      await prisma.cleanDatabase();
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
          socialSecurity: 324324328,
          username: 'Test User',
          password: 'testuserpassword',
        };

        it('should validate request', function () {
          const faultyDto = { ...dto };
          faultyDto.password = '';
          return spec()
            .post('auth/signup')
            .withBody(faultyDto)
            .expectBody({ statusCode: 400, message: ['password should not be empty'], error: 'Bad Request' })
            .inspect();
        });

        it('should sign up', function () {
          return spec().post('auth/signup').withBody(dto).expectStatus(201);
        });
      });
      describe('Signin', function () {
        it('should sign in', function () {});
      });
      describe('Signout', function () {
        it('should sign out', function () {});
      });
    });
  });
});
