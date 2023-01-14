import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ElectionCreateDto, SigninDto, VoterSignupDto } from '@dvs/api';
import { AdminDto, PrismaService } from '@dvs/prisma';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppModule } from '@dvs/server';
import { request, spec } from 'pactum';
import * as argon from 'argon2';
import {
  randCity,
  randEmail,
  randFirstName,
  randLastName,
  randNumber,
  randPassword,
  randStreetAddress,
} from '@ngneat/falso';

describe('Scalability e2e', () => {
  describe('e2e running...', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    const host = 'http://localhost:3333/api/';

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
    const voterList: VoterSignupDto[] = [];
    const voterNumber = Number(process.env.VOTER_NUM);

    for (let i = 0; i < voterNumber; i++) {
      voterList.push({
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
      request.setDefaultTimeout(10 * 1000);

      // prisma
      prisma = app.get(PrismaService);
      await prisma.withCleanDatabase();
      await prisma.withAdmin(admin);
    });

    afterAll(function () {
      app.close();
    });

    describe('Creating election...', function () {
      it('Signing in admin...', function () {
        const dto: SigninDto = {
          email: admin.email,
          password: 'adminpw',
        };

        return spec().post('auth/signin').withBody(dto).expectStatus(200).stores('access_tokenA', 'access_token');
      });

      it('Creating new election...', function () {
        const headersAdmin = { Authorization: 'Bearer $S{access_tokenA}' };
        const dto: ElectionCreateDto = {
          name: 'US Presidential Election 2020',
          image: 'https://google.de',
          candidates: [
            { name: 'Donald J. Trump', image: '', party: 'GOP' },
            { name: 'Joe Biden', image: '', party: 'Democrats' },
          ],
          description:
            'After both parties have chosen their respective candidates, the election process for the 2020 presidential election will commence on November, 3.',
          eligibleVoters: voterList.map((voter) => voter.ssn),
          expires: Math.round(new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() / 1000),
        };
        return spec()
          .post('admin/election/create')
          .withHeaders(headersAdmin)
          .withBody(dto)
          .expectStatus(201)
          .stores('ElectionId', 'id');
      });
    });

    describe('Run concurrently', function () {
      test.concurrent.each(voterList.map((voter) => [voter.firstName + ' ' + voter.lastName, voter]))(
        '==== Voter %s ====',
        async function (name: string, voter: VoterSignupDto) {
          const headersVoter = { Authorization: null };
          let mnemonic: string;

          await spec().post('auth/signup').withBody(voter).expectStatus(201);

          await spec()
            .post('auth/signin')
            .withBody({ email: voter.email, password: voter.password })
            .expectStatus(200)
            .toss()
            .then((res) => {
              headersVoter.Authorization = `Bearer ${res.body.access_token}`;
            });

          await spec()
            .post('election/register/' + `{id}`)
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody({ ssn: voter.ssn })
            .expectStatus(201)
            .toss()
            .then((res) => {
              mnemonic = res.body.mnemonic;
            });

          await spec()
            .post('election/vote/' + '{id}')
            .withPathParams('id', '$S{ElectionId}')
            .withHeaders(headersVoter)
            .withBody({ mnemonic, candidate: 0 })
            .expectStatus(201);
        },
        20000,
      );
    });
  });
});
