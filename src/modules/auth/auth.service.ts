import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  encrypitPassword,
  validateEmail,
  validateNameUser,
  validatePassword,
} from './utils/auth.utils';
import type { IUser, IUserRepository } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUserDTO: CreateUserDto): Promise<{ message: string }> {
    try {
      this.validateUserFields(createUserDTO);

      await this.verifyUserExists(createUserDTO.email);

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
      if (existsUser) {
        throw new Error('Email já cadastrado. Por favor, use outro email.');
      }
      return false;
    } catch (error) {
      throw new Error(
        'Erro ao verificar existência do usuário: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
