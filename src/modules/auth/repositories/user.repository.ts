import { Injectable } from '@nestjs/common';
import { IUser, IUserRepository } from '../interfaces/user.interface';
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
      throw new Error(
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
      throw new Error(
        'Erro encontrar usuário por email: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
