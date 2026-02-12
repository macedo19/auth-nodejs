import { validate } from 'class-validator';
import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/status')
  getStatus() {
    return { status: 'is Alive !!' };
  }

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.createUser(createUserDto);
      res
        .status(HttpStatus.CREATED)
        .json({ message: result.message || 'User created successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error ? error.message : 'Internal server error' });
    }
  }
}
