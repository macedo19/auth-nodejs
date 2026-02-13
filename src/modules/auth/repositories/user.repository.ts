import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IUser,
  IUserRepository,
  IUsersResponse,
} from '../interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User, 'mysql')
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: IUser): Promise<IUser | null> {
    try {
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      return newUser as IUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro encontrado ao criar usuário: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async verifyEmail(email: string): Promise<boolean> {
    try {
      const rowUser = await this.userRepository.findOne({ where: { email } });
      return !!rowUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro encontrar usuário por email: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async listUsers(): Promise<IUsersResponse[]> {
    try {
      const users = await this.userRepository.find();
      const result: IUsersResponse[] = [];
      for (const user of users) {
        result.push({
          nome: user.name,
          sobrenome: user.lastName,
          email: user.email,
          cadastrado_em: user.createdAt,
        });
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao listar usuários: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const rowUser = await this.userRepository.findOne({ where: { email } });
      return rowUser ? (rowUser as IUser) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro encontrar usuário por email: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
