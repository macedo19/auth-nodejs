import {
  IsAlpha,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser em formato de texto' })
  @IsAlpha('pt-BR', { message: 'O nome deve conter apenas letras' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(1, 100, { message: 'O nome deve ter entre 1 e 100 caracteres' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(1, 10)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, letras minúsculas e números',
    },
  )
  senha: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsAlpha('pt-BR', { message: 'O sobrenome deve conter apenas letras' })
  @Length(1, 50, { message: 'O sobrenome deve ter entre 1 e 50 caracteres' })
  sobrenome?: string;

  @IsString()
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  documento: string;

  @IsOptional()
  @IsIn([true, false], {
    message: 'O campo brasileiro deve ser true ou false',
  })
  brasileiro?: boolean;
}
