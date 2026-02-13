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
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async criar(usuario: IUser): Promise<IUser | null> {
    try {
      const novoUsuario = this.usuarioRepository.create(usuario);
      await this.usuarioRepository.save(novoUsuario);
      return novoUsuario as IUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao criar usuário: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async verificarEmail(email: string): Promise<boolean> {
    try {
      const usuarioEncontrado = await this.usuarioRepository.findOne({
        where: { email },
      });
      return !!usuarioEncontrado;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar usuário por email: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async listarUsuarios(): Promise<IUsersResponse[]> {
    try {
      const usuarios = await this.usuarioRepository.find();
      const resultado: IUsersResponse[] = [];
      for (const usuario of usuarios) {
        resultado.push({
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          numero_documento: usuario.documento,
          estrangeiro: usuario.brasileiro ? 'Não' : 'Sim',
          cadastrado_em: usuario.criadoEm,
        });
      }
      return resultado;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao listar usuários: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<IUser | null> {
    try {
      const usuarioEncontrado = await this.usuarioRepository.findOne({
        where: { email },
      });
      return usuarioEncontrado ? (usuarioEncontrado as IUser) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar usuário por email: ' +
          (error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
