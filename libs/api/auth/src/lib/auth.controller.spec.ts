import { Test } from '@nestjs/testing';
import { AuthController } from '@dvs/api/auth';
import { AuthService } from '@dvs/api/auth';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
