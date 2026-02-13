import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserBasicAuthRespository } from '../interfaces/user-basic-auth.interface';
import { UserBasicAuth } from '../entity/users-basic-auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserBasicAuthRepository implements IUserBasicAuthRespository {
  constructor(
    @InjectRepository(UserBasicAuth, 'mysql')
    private readonly userRepository: Repository<UserBasicAuth>,
  ) {}

  async saveBasicAuth(userId: number, basicAuth: string): Promise<void> {
    const rowUserBasicAuth = await this.userRepository.findOne({
      where: { idUser: userId },
    });
    if (rowUserBasicAuth) {
      rowUserBasicAuth.basicAuth = basicAuth;
      await this.userRepository.save(rowUserBasicAuth);
    } else {
      const newUserBasicAuth = this.userRepository.create({
        idUser: userId,
        basicAuth,
      });
      await this.userRepository.save(newUserBasicAuth);
    }
  }

  async existsByBasicAuth(basicAuth: string): Promise<boolean> {
    try {
      const rowUserBasicAuth = await this.userRepository.findOne({
        where: { basicAuth },
      });
      return !!rowUserBasicAuth;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao validar basic auth: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
