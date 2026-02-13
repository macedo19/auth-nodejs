import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  gerarHashSenha,
  validarDocumento,
  decodificarBase64,
  compararSenha,
} from './utils/auth.utils';
import type {
  IUser,
  IUserRepository,
  IUsersResponse,
} from './interfaces/user.interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ReponseListUsers } from './types/user-response.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private gerenciadorCache: Cache,
    @Inject('IUserRepository')
    private readonly repositorioUsuario: IUserRepository,
  ) {}

  async criarUsuario(
    criarUsuarioDTO: CreateUserDto,
  ): Promise<{ message: string }> {
    const usuarioExistente = await this.verificarUsuarioExistente(
      criarUsuarioDTO.email,
    );

    if (usuarioExistente) {
      throw new BadRequestException(
        'Email já cadastrado. Por favor, use outro email.',
      );
    }

    const documentoValido = validarDocumento(
      criarUsuarioDTO.documento,
      criarUsuarioDTO.brasileiro ?? true,
    );

    if (!documentoValido) {
      throw new BadRequestException(
        'Documento inválido. Por favor, forneça um documento válido no formato de CPF ou RNE.',
      );
    }

    const usuario: IUser = {
      nome: criarUsuarioDTO.nome,
      sobrenome: criarUsuarioDTO.sobrenome,
      email: criarUsuarioDTO.email,
      senha: await gerarHashSenha(criarUsuarioDTO.senha),
      documento: criarUsuarioDTO.documento,
      brasileiro: criarUsuarioDTO.brasileiro ?? true,
    };

    const usuarioCriado = await this.repositorioUsuario.criar(usuario);

    if (!usuarioCriado) {
      throw new BadRequestException(
        'Erro ao criar usuário. Por favor, tente novamente.',
      );
    }

    return { message: `Usuário ${usuario.nome} criado com sucesso` };
  }

  async verificarUsuarioExistente(email: string): Promise<IUser | null> {
    const usuarioExistente =
      await this.repositorioUsuario.buscarUsuarioPorEmail(email);
    return usuarioExistente;
  }

  async autenticarUsuario(email: string, senha: string): Promise<boolean> {
    const usuario = await this.repositorioUsuario.buscarUsuarioPorEmail(email);
    if (!usuario) {
      return false;
    }

    const senhaValida = await compararSenha(senha, usuario.senha);
    if (!senhaValida) {
      return false;
    }

    return true;
  }

  async validarAutenticacaoBasica(
    cabecalhoAutorizacao?: string,
  ): Promise<boolean> {
    if (!cabecalhoAutorizacao) {
      return false;
    }

    const [esquema, token] = cabecalhoAutorizacao.split(' ');
    if (esquema !== 'Basic' || !token) {
      return false;
    }

    const tokenDecodificado = decodificarBase64(token);
    if (!tokenDecodificado.includes(':')) {
      return false;
    }
    const [email, senha] = tokenDecodificado.split(':');

    return this.autenticarUsuario(email, senha);
  }

  async listarUsuarios(): Promise<ReponseListUsers> {
    const usuariosEmCache =
      await this.gerenciadorCache.get<IUsersResponse[]>('lista_usuarios');
    if (usuariosEmCache) {
      return {
        message: 'Usuários retornados com sucesso (uso do cache)',
        users: usuariosEmCache,
      };
    }

    const usuarios: IUsersResponse[] =
      await this.repositorioUsuario.listarUsuarios();
    await this.gerenciadorCache.set('lista_usuarios', usuarios);
    return {
      message: 'Usuários retornados com sucesso',
      users: usuarios,
    };
  }
}
