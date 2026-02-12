import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  comparePassword,
  encrypitPassword,
  validateDocument,
} from './utils/auth.utils';
import type {
  IUser,
  IUserRepository,
  IUsersResponse,
} from './interfaces/user.interface';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
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

  async verifyUserExists(email: string): Promise<boolean | void> {
    const existsUser = await this.userRepository.verifyEmail(email);
    return existsUser ? true : false;
  }

  async loginUser(userLoginDTO: UserLoginDto): Promise<{ message: string }> {
    try {
      const userExist = await this.userRepository.verifyEmail(
        userLoginDTO.email,
      );
      if (!userExist) {
        throw new Error('Usuário não encontrado com o email fornecido.');
      }

      const hashedPassword = await this.userRepository.getHashedPassword(
        userLoginDTO.email,
      );

      const passwordMatch = await comparePassword(
        userLoginDTO.senha,
        hashedPassword,
      );

      if (!passwordMatch) {
        throw new Error('Senha incorreta. Por favor, tente novamente.');
      }

      return { message: 'User logged in successfully' };
    } catch (error) {
      throw new Error(
        'Erro ao fazer login: ' + (error ? error.message : 'Erro desconhecido'),
      );
    }
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
