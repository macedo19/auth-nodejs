export interface IUser {
  name: string;
  lastName?: string;
  email: string;
  password: string;
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
  getHashedPassword(email: string): Promise<string>;
  listUsers(): Promise<IUsersResponse[]>;
}
