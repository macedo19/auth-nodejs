import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { IUserRepository } from '../../src/modules/auth/interfaces/user.interface';
import { encrypitPassword } from '../../src/modules/auth/utils/auth.utils';

describe('AuthService', () => {
  let service: AuthService;
  let repository: IUserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            getHashedPassword: jest.fn().mockResolvedValue('hashedPassword'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validar campos do usuário - nome inválido', async () => {
    const createUserDTO = {
      nome: 'John123',
      senha: 'Password1',
      email: 'john.doe@example.com',
    };

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Nome do usuário inválido. O nome deve conter apenas letras e espaços.',
    );
  });

  it('validar campos do usuário - senha inválida', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'pass',
      email: 'john.doe@example.com',
    };

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Senha do usuário inválida. A senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, letras minúsculas e números.',
    );
  });

  it('validar campos do usuário - email inválido', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example',
    };

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Email do usuário inválido. O email deve ser um endereço de email válido.',
    );
  });

  it('validar campos do usuário - sobrenome inválido', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith123',
    };

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Sobrenome do usuário inválido. O sobrenome deve conter apenas letras e espaços.',
    );
  });

  it('deve criar um usuário com campos válidos', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith',
    };

    await expect(service.createUser(createUserDTO)).resolves.toEqual({
      message: `User ${createUserDTO.nome} created successfully`,
    });
  });

  it('deve criar um usuário sem sobrenome', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
    };

    await expect(service.createUser(createUserDTO)).resolves.toEqual({
      message: `User ${createUserDTO.nome} created successfully`,
    });
  });

  it('deve lançar um erro ao criar um usuário com email já existente', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'existing@example.com',
    };

    jest.spyOn(repository, 'verifyEmail').mockResolvedValue(true);

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Problema ao criar usuário: Email já cadastrado. Por favor, use outro email.',
    );
  });

  it(' deve validar se senha foi criptografada corretamente', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
    };

    await expect(encrypitPassword(createUserDTO.senha)).resolves.not.toBe(
      createUserDTO.senha,
    );
  });

  it('deve lançar um erro ao fazer login com senha incorreta', async () => {
    const userLoginDTO = {
      email: 'john.doe@example.com',
      senha: 'WrongPassword',
    };

    jest
      .spyOn(repository, 'getHashedPassword')
      .mockResolvedValue('hashedPassword');
    jest
      .spyOn(service, 'loginUser')
      .mockRejectedValue(new Error('Senha incorreta'));

    await expect(service.loginUser(userLoginDTO)).rejects.toThrow(
      'Senha incorreta',
    );
  });

  it('deve fazer login com sucesso caso a senha esteja correta', async () => {
    const userLoginDTO = {
      email: 'john.doe@example.com',
      senha: 'Password1',
    };

    jest
      .spyOn(repository, 'getHashedPassword')
      .mockResolvedValue('hashedPassword');
    jest
      .spyOn(service, 'loginUser')
      .mockResolvedValue({ message: 'User logged in successfully' });

    await expect(service.loginUser(userLoginDTO)).resolves.toEqual({
      message: 'User logged in successfully',
    });
  });
});
