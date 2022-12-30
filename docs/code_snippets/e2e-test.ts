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

    it('should not register ineligible voters', function () {
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
      faultyDto.mnemonic = 'town sun north elevator rubber crack dolphin runway liar awake try iron crew relief basic';
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
