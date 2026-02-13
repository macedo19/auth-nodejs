import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBasicAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReponseListUsers } from './types/user-response.type';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/status')
  getStatus() {
    return { status: 'is Alive !!' };
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Endpoint para criar um novo usuário',
    description:
      'Este endpoint permite criar um novo usuário. ' +
      'O corpo da requisição deve conter os seguintes campos: ' +
      'nome, senha, email, sobrenome, documento e brasileiro (opcional). ' +
      'O campo "brasileiro" é um booleano que indica se o usuário é brasileiro ou não. ' +
      'Se for true, o usuário será considerado brasileiro.',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Erro de validação ou regra de negócio',
  })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.createUser(createUserDto);
    res
      .status(HttpStatus.CREATED)
      .json({ message: result.message || 'User created successfully' });
  }

  @Get('/lista-usuarios')
  @ApiOperation({
    summary: 'Endpoint para listar todos os usuários',
    description:
      'Este endpoint retorna uma lista de todos os usuários cadastrados no sistema. ' +
      'Sistema usa cache para otimizar a performance, então as informações podem ser atualizadas a cada 60 segundos. ' +
      'A resposta inclui o nome, sobrenome, email e documento de cada usuário.',
  })
  @ApiBasicAuth()
  @ApiHeader({
    name: 'Authorization',
    description:
      'Autenticação é necessária para acessar este endpoint. Use o formato "Authorization: Basic <token>". ' +
      'O token deve ser gerado a partir do email e senha do usuário, codificados em Base64.',
  })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso',
    type: ReponseListUsers,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas ou ausentes',
  })
  @CacheTTL(60)
  async listUsers(@Res() res: Response) {
    const result: ReponseListUsers = await this.authService.listUsers();
    res.status(HttpStatus.OK).json(result);
  }
}
