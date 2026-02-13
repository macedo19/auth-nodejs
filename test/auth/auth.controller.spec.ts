import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthController', () => {
  let controlador: AuthController;
  let servico: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: 'IUserRepository',
          useValue: {
            criar: jest.fn().mockResolvedValue({
              nome: 'John Doe',
              email: 'john.doe@example.com',
              senha: 'hashedPassword',
              sobrenome: 'Smith',
            }),
            buscarUsuarioPorEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controlador = module.get<AuthController>(AuthController);
    servico = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controlador).toBeDefined();
  });

  it('should have AuthService defined', () => {
    expect(servico).toBeDefined();
  });
});
