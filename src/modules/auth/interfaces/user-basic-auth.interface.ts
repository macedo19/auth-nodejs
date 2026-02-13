export interface IUserBasicAuthRespository {
  saveBasicAuth(userId: number, basicAuth: string): Promise<void>;
  existsByBasicAuth(basicAuth: string): Promise<boolean>;
}
