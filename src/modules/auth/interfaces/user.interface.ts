export interface IUser {
  id?: number;
  nome: string;
  sobrenome?: string;
  email: string;
  senha: string;
  documento: string;
  brasileiro: boolean;
}

export interface IUsersResponse {
  nome: string;
  sobrenome?: string;
  email: string;
  numero_documento: string;
  estrangeiro: string;
  cadastrado_em: Date;
}

export interface IUserRepository {
  criar(usuario: IUser): Promise<IUser | null>;
  verificarEmail(email: string): Promise<boolean>;
  listarUsuarios(): Promise<IUsersResponse[]>;
  buscarUsuarioPorEmail(email: string): Promise<IUser | null>;
}
