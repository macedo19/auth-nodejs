import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Gabriel',
  })
  @IsString({ message: 'O nome deve ser em formato de texto' })
  @IsAlpha('pt-BR', { message: 'O nome deve conter apenas letras' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(1, 100, { message: 'O nome deve ter entre 1 e 100 caracteres' })
  nome: string;

  @ApiProperty({
    description:
      'Senha do usuário. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, letras minúsculas e números',
    example: 'Senha123',
  })
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

  @ApiProperty({
    description: 'Email do usuário',
    example: 'gabriel@email.com',
  })
  @IsString()
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    description: 'Sobrenome do usuário. Não é obrigatório',
    example: 'Macedo',
  })
  @IsOptional()
  @IsString()
  @IsAlpha('pt-BR', { message: 'O sobrenome deve conter apenas letras' })
  @Length(1, 50, { message: 'O sobrenome deve ter entre 1 e 50 caracteres' })
  sobrenome?: string;

  @ApiProperty({
    description:
      'Documento do usuário. Caso seja CPF, deve seguir o formato XXX.XXX.XXX-XX ou XXXXXXXXXXX . Caso seja RNE(Documento estrangeiro), deve seguir o formato XXXXXX-X ou XXXXXXX',
    example: '123.456.789-09',
  })
  @IsString()
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  documento: string;

  @ApiProperty({
    required: false,
    description:
      'Indica se o usuário é brasileiro. Não é obrigatório. Caso for encaminhar parametro como true, o usuário será considerado brasileiro.',
    example: true,
  })
  @IsOptional()
  @IsIn([true, false], {
    message: 'O campo brasileiro deve ser true ou false',
  })
  brasileiro?: boolean;
}
