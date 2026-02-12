import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
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

  @Post('/login')
  async loginUser(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const result = await this.authService.loginUser(userLoginDto);
    res.status(HttpStatus.ACCEPTED).json({
      basic_auth: result.basic_auth,
      message: result.message || 'User logged in successfully',
    });
  }

  @Get('/lista-usuarios')
  async listUsers(@Res() res: Response) {
    try {
      const result = await this.authService.listUsers();
      res.status(HttpStatus.OK).json({
        message: result.message || 'Users retrieved successfully',
        users: result.users,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error ? error.message : 'Internal server error' });
    }
  }
}
