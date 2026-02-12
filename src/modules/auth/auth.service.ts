import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  comparePassword,
  encrypitPassword,
  validateEmail,
  validateNameUser,
  validatePassword,
} from './utils/auth.utils';
import type { IUser, IUserRepository } from './interfaces/user.interface';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUserDTO: CreateUserDto): Promise<{ message: string }> {
    try {
      this.validateUserFields(createUserDTO);

      const existsUser = await this.verifyUserExists(createUserDTO.email);

      if (existsUser) {
        throw new Error('Email já cadastrado. Por favor, use outro email.');
      }

      const user: IUser = {
        name: createUserDTO.nome,
        lastName: createUserDTO.sobrenome,
        email: createUserDTO.email,
        password: await encrypitPassword(createUserDTO.senha),
      };

      const userCreated = await this.userRepository.create(user);

      if (!userCreated) {
        throw new Error('Erro ao criar usuário. Por favor, tente novamente.');
      }

      return { message: `User ${userCreated.name} created successfully` };
    } catch (error) {
      throw new Error(
        'Problema ao criar usuário: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  validateUserFields(createUserDTO: CreateUserDto): boolean | void {
    if (!validateNameUser(createUserDTO.nome)) {
      throw new Error(
        'Nome do usuário inválido. O nome deve conter apenas letras e espaços.',
      );
    }

    if (!validatePassword(createUserDTO.senha)) {
      throw new Error(
        'Senha do usuário inválida. A senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, letras minúsculas e números.',
      );
    }

    if (!validateEmail(createUserDTO.email)) {
      throw new Error(
        'Email do usuário inválido. O email deve ser um endereço de email válido.',
      );
    }

    if (createUserDTO.sobrenome && !validateNameUser(createUserDTO.sobrenome)) {
      throw new Error(
        'Sobrenome do usuário inválido. O sobrenome deve conter apenas letras e espaços.',
      );
    }
    return true;
  }

  async verifyUserExists(email: string): Promise<boolean | void> {
    try {
      const existsUser = await this.userRepository.verifyEmail(email);
      return existsUser ? true : false;
    } catch (error) {
      throw new Error(
        'Erro ao verificar existência do usuário: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
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
}
