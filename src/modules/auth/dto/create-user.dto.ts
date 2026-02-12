import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  senha: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(1, 100)
  sobrenome?: string;
}
