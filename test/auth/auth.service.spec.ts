import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { IUserRepository } from '../../src/modules/auth/interfaces/user.interface';
import {
  gerarHashSenha,
  validarDocumento,
} from '../../src/modules/auth/utils/auth.utils';
import * as authUtils from '../../src/modules/auth/utils/auth.utils';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../src/modules/auth/dto/create-user.dto';

describe('AuthService', () => {
  let servico: AuthService;
  let repositorio: IUserRepository;
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
            criar: jest.fn().mockResolvedValue({
              nome: 'John Doe',
              email: 'john.doe@example.com',
              senha: 'hashedPassword',
              sobrenome: 'Smith',
            }),
            buscarUsuarioPorEmail: jest.fn().mockResolvedValue(null),
            listarUsuarios: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    servico = module.get<AuthService>(AuthService);
    repositorio = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(servico).toBeDefined();
  });

  it('deve verificar se é um cpf válido para usuário brasileiro', () => {
    const criarUsuarioDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    validarDocumento(
      criarUsuarioDTO.documento,
      criarUsuarioDTO.brasileiro ?? false,
    );
  });

  it('deve validar o Basic Auth com base64 válido', async () => {
    const email = 'john.doe@example.com';
    const senha = 'Password1';
    const token = Buffer.from(`${email}:${senha}`).toString('base64');

    jest.spyOn(repositorio, 'buscarUsuarioPorEmail').mockResolvedValue({
      id: 1,
      nome: 'John Doe',
      email,
      senha: 'hashedPassword',
      sobrenome: 'Smith',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    jest.spyOn(authUtils, 'compararSenha').mockResolvedValue(true);

    await expect(
      servico.validarAutenticacaoBasica(`Basic ${token}`),
    ).resolves.toBe(true);
  });

  it('deve negar Basic Auth sem header', async () => {
    await expect(servico.validarAutenticacaoBasica(undefined)).resolves.toBe(
      false,
    );
  });

  it('deve negar Basic Auth com esquema inválido', async () => {
    const token = Buffer.from('john.doe@example.com:Password1').toString(
      'base64',
    );

    await expect(
      servico.validarAutenticacaoBasica(`Bearer ${token}`),
    ).resolves.toBe(false);
  });

  it('deve lançar erro com base64 válido e usuário inexistente', async () => {
    const token = Buffer.from('john.doe@example.com:Password1').toString(
      'base64',
    );

    jest.spyOn(repositorio, 'buscarUsuarioPorEmail').mockResolvedValue(null);

    await expect(
      servico.validarAutenticacaoBasica(`Basic ${token}`),
    ).resolves.toBe(false);
  });

  it('deve lançar erro com senha inválida', async () => {
    const email = 'john.doe@example.com';
    const senha = 'Password1';
    const token = Buffer.from(`${email}:${senha}`).toString('base64');

    jest.spyOn(repositorio, 'buscarUsuarioPorEmail').mockResolvedValue({
      id: 1,
      nome: 'John Doe',
      email,
      senha: 'hashedPassword',
      sobrenome: 'Smith',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    jest.spyOn(authUtils, 'compararSenha').mockResolvedValue(false);

    await expect(
      servico.validarAutenticacaoBasica(`Basic ${token}`),
    ).resolves.toBe(false);
  });

  it('validar campos do usuário - nome inválido', async () => {
    const criarUsuarioDTO = plainToInstance(CreateUserDto, {
      nome: 'John123',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(criarUsuarioDTO);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isAlpha');
  });

  it('validar campos do usuário - senha inválida', async () => {
    const criarUsuarioDTO = plainToInstance(CreateUserDto, {
      nome: 'John',
      senha: 'pass',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(criarUsuarioDTO);
    expect(errors.length).toBeGreaterThan(0);
    const senhaError = errors.find((err) => err.property === 'senha');
    expect(senhaError?.constraints).toHaveProperty('isStrongPassword');
  });

  it('validar campos do usuário - email inválido', async () => {
    const criarUsuarioDTO = plainToInstance(CreateUserDto, {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(criarUsuarioDTO);
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find((err) => err.property === 'email');
    expect(emailError?.constraints).toHaveProperty('isEmail');
  });

  it('validar campos do usuário - sobrenome inválido', async () => {
    const criarUsuarioDTO = plainToInstance(CreateUserDto, {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith123',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    const errors = await validate(criarUsuarioDTO);
    expect(errors.length).toBeGreaterThan(0);
    const sobrenomeError = errors.find((err) => err.property === 'sobrenome');
    expect(sobrenomeError?.constraints).toHaveProperty('isAlpha');
  });

  it('deve criar um usuário com campos válidos', async () => {
    const criarUsuarioDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      sobrenome: 'Smith',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    await expect(servico.criarUsuario(criarUsuarioDTO)).resolves.toEqual({
      message: `User ${criarUsuarioDTO.nome} created successfully`,
    });
  });

  it('deve criar um usuário sem sobrenome', async () => {
    const criarUsuarioDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    await expect(servico.criarUsuario(criarUsuarioDTO)).resolves.toEqual({
      message: `User ${criarUsuarioDTO.nome} created successfully`,
    });
  });

  it('deve lançar um erro ao criar um usuário com email já existente', async () => {
    const criarUsuarioDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'existing@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    jest.spyOn(repositorio, 'buscarUsuarioPorEmail').mockResolvedValue({
      id: 1,
      nome: 'John Doe',
      email: 'existing@example.com',
      senha: 'hashedPassword',
      sobrenome: 'Smith',
      documento: '529.982.247-25',
      brasileiro: true,
    });

    await expect(servico.criarUsuario(criarUsuarioDTO)).rejects.toThrow(
      'Email já cadastrado. Por favor, use outro email.',
    );
  });

  it(' deve validar se senha foi criptografada corretamente', async () => {
    const criarUsuarioDTO = {
      nome: 'John Doe',
      senha: 'Password1',
      email: 'john.doe@example.com',
      documento: '529.982.247-25',
      brasileiro: true,
    };

    await expect(gerarHashSenha(criarUsuarioDTO.senha)).resolves.not.toBe(
      criarUsuarioDTO.senha,
    );
  });
});
