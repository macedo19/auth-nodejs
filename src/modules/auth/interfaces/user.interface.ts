export interface IUser {
  id?: number;
  name: string;
  lastName?: string;
  email: string;
  password: string;
  document: string;
  isBrazilian: boolean;
}

export interface IUsersResponse {
  nome: string;
  sobrenome?: string;
  email: string;
  cadastrado_em: Date;
}

export interface IUserRepository {
  create(user: IUser): Promise<IUser | null>;
  verifyEmail(email: string): Promise<boolean>;
  listUsers(): Promise<IUsersResponse[]>;
  getUserByEmail(email: string): Promise<IUser | null>;
}
