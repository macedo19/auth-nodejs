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
    const credenciaisValidas = await this.authService.validarAutenticacaoBasica(
      req.headers.authorization,
    );

    if (!credenciaisValidas) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    next();
  }
}
