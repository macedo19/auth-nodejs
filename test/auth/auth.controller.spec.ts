import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: {
            create: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'hashedPassword',
              lastName: 'Smith',
            }),
            verifyEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have AuthService defined', () => {
    expect(service).toBeDefined();
  });
});
