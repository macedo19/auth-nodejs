import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { IUserRepository } from '../../src/modules/auth/interfaces/user.interface';
import {
  encrypitPassword,
  validateDocument,
} from '../../src/modules/auth/utils/auth.utils';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../src/modules/auth/dto/create-user.dto';

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

  it('deve verificar se é um cpf válido para usuário brasileiro', () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    validateDocument(
      createUserDTO.documento,
      createUserDTO.brasileiro ?? false,
    );
  });

  it('validar campos do usuário - nome inválido', async () => {
    const createUserDTO = plainToInstance(CreateUserDto, {
      nome: 'John123',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(createUserDTO);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isAlpha');
  });

  it('validar campos do usuário - senha inválida', async () => {
    const createUserDTO = plainToInstance(CreateUserDto, {
      nome: 'John',
      senha: 'pass',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(createUserDTO);
    expect(errors.length).toBeGreaterThan(0);
    const senhaError = errors.find((err) => err.property === 'senha');
    expect(senhaError?.constraints).toHaveProperty('isStrongPassword');
  });

  it('validar campos do usuário - email inválido', async () => {
    const createUserDTO = plainToInstance(CreateUserDto, {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(createUserDTO);
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find((err) => err.property === 'email');
    expect(emailError?.constraints).toHaveProperty('isEmail');
  });

  it('validar campos do usuário - sobrenome inválido', async () => {
    const createUserDTO = plainToInstance(CreateUserDto, {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith123',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(createUserDTO);
    expect(errors.length).toBeGreaterThan(0);
    const sobrenomeError = errors.find((err) => err.property === 'sobrenome');
    expect(sobrenomeError?.constraints).toHaveProperty('isAlpha');
  });

  it('deve criar um usuário com campos válidos', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith',
      documento: '529.982.247-25',
      brasileiro: true,
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
      documento: '529.982.247-25',
      brasileiro: true,
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
      documento: '529.982.247-25',
      brasileiro: true,
    };

    jest.spyOn(repository, 'verifyEmail').mockResolvedValue(true);

    await expect(service.createUser(createUserDTO)).rejects.toThrow(
      'Email já cadastrado. Por favor, use outro email.',
    );
  });

  it(' deve validar se senha foi criptografada corretamente', async () => {
    const createUserDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
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
