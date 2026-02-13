import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isValid = await this.authService.validateBasicAuth(
      req.headers.authorization,
    );

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    next();
  }
}
