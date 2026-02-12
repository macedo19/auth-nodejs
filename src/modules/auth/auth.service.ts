import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  comparePassword,
  encodeBase64,
  encrypitPassword,
  validateDocument,
} from './utils/auth.utils';
import type {
  IUser,
  IUserRepository,
  IUsersResponse,
} from './interfaces/user.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import type { IUserBasicAuthRespository } from './interfaces/user-basic-auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IUserBasicAuthRespository')
    private readonly userBasicAuthRepository: IUserBasicAuthRespository,
  ) {}

  async createUser(createUserDTO: CreateUserDto): Promise<{ message: string }> {
    const existsUser = await this.verifyUserExists(createUserDTO.email);

    if (existsUser) {
      throw new BadRequestException(
        'Email já cadastrado. Por favor, use outro email.',
      );
    }

    const isValidDocument = validateDocument(
      createUserDTO.documento,
      createUserDTO.brasileiro ?? true,
    );

    if (!isValidDocument) {
      throw new BadRequestException(
        'Documento inválido. Por favor, forneça um documento válido no formato de CPF ou RNE.',
      );
    }

    const user: IUser = {
      name: createUserDTO.nome,
      lastName: createUserDTO.sobrenome,
      email: createUserDTO.email,
      password: await encrypitPassword(createUserDTO.senha),
      document: createUserDTO.documento,
      isBrazilian: createUserDTO.brasileiro ?? true,
    };

    const userCreated = await this.userRepository.create(user);

    if (!userCreated) {
      throw new BadRequestException(
        'Erro ao criar usuário. Por favor, tente novamente.',
      );
    }

    return { message: `User ${user.name} created successfully` };
  }

  async verifyUserExists(email: string): Promise<IUser | null> {
    const existsUser = await this.userRepository.getUserByEmail(email);
    return existsUser;
  }

  async loginUser(
    userLoginDTO: UserLoginDto,
  ): Promise<{ message: string; basic_auth: string }> {
    const userExist = await this.verifyUserExists(userLoginDTO.email);
    if (!userExist) {
      throw new BadRequestException(
        'Usuário não encontrado com o email fornecido.',
      );
    }
    const passwordMatch = await comparePassword(
      userLoginDTO.senha,
      userExist.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException(
        'Senha incorreta. Por favor, tente novamente.',
      );
    }

    const bufferBasicAuth = await this.generateAndSaveBasicAuth(
      Number(userExist.id),
      `${userLoginDTO.email}:${userLoginDTO.senha}`,
    );

    return {
      basic_auth: bufferBasicAuth,
      message: 'User logged in successfully',
    };
  }

  async generateAndSaveBasicAuth(
    userId: number,
    basicAuth: string,
  ): Promise<string> {
    const encodedBasicAuth = encodeBase64(basicAuth);
    await this.userBasicAuthRepository.saveBasicAuth(userId, encodedBasicAuth);
    return encodedBasicAuth;
  }

  async listUsers(): Promise<{ message: string; users: IUsersResponse[] }> {
    try {
      const users: IUsersResponse[] = await this.userRepository.listUsers();
      return {
        message: 'Users retrieved successfully',
        users,
      };
    } catch (error) {
      throw new Error(
        'Erro ao listar usuários: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
