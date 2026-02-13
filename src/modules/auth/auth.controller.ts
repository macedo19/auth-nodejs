import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { CacheTTL } from '@nestjs/cache-manager';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/status')
  getStatus() {
    return { status: 'is Alive !!' };
  }

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.createUser(createUserDto);
    res
      .status(HttpStatus.CREATED)
      .json({ message: result.message || 'User created successfully' });
  }

  @Get('/lista-usuarios')
  @CacheTTL(60)
  async listUsers(@Res() res: Response) {
    const result = await this.authService.listUsers();
    res.status(HttpStatus.OK).json({
      message: result.message || 'Users retrieved successfully',
      users: result.users,
    });
  }
}
