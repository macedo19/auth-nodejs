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
import type { Cache } from '@nestjs/cache-manager';
import type { IUserBasicAuthRespository } from '../../src/modules/auth/interfaces/user-basic-auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let repository: IUserRepository;
  let userBasicAuthRepository: IUserBasicAuthRespository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            create: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'hashedPassword',
              lastName: 'Smith',
            }),
            getUserByEmail: jest.fn().mockResolvedValue(null),
            listUsers: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: 'IUserBasicAuthRespository',
          useValue: {
            saveBasicAuth: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<IUserRepository>('IUserRepository');
    userBasicAuthRepository = module.get<IUserBasicAuthRespository>(
      'IUserBasicAuthRespository',
    );
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

    jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'hashedPassword',
      lastName: 'Smith',
      document: '529.982.247-25',
      isBrazilian: true,
    });

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

  it('deve gerar e salvar o base64 do basic auth corretamente', async () => {
    const userId = 10;
    const rawBasicAuth = 'john.doe@example.com:Password1';
    const expectedBase64 = Buffer.from(rawBasicAuth).toString('base64');

    const result = await service.generateAndSaveBasicAuth(userId, rawBasicAuth);

    expect(result).toBe(expectedBase64);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userBasicAuthRepository.saveBasicAuth).toHaveBeenCalledWith(
      userId,
      expectedBase64,
    );
  });
});
