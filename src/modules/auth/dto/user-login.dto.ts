import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  senha: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;
}
