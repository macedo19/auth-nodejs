import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;
}
