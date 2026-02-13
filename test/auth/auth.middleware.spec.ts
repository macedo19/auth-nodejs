import { UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from '../../src/modules/auth/middleware/auth.middleware';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let servicoAuth: AuthService;

  beforeEach(() => {
    servicoAuth = {
      validarAutenticacaoBasica: jest.fn(),
    } as unknown as AuthService;

    middleware = new AuthMiddleware(servicoAuth);
  });

  it('deve chamar next quando credenciais são válidas', async () => {
    jest
      .spyOn(servicoAuth, 'validarAutenticacaoBasica')
      .mockResolvedValue(true);

    const req = {
      headers: {
        authorization: 'Basic dGVzdEBtYWlsLmNvbTpTZW5oYTEyMw==',
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    await middleware.use(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('deve lançar UnauthorizedException quando credenciais são inválidas', async () => {
    jest
      .spyOn(servicoAuth, 'validarAutenticacaoBasica')
      .mockResolvedValue(false);

    const req = {
      headers: {
        authorization: 'Basic invalid',
      },
    } as Request;
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(next).not.toHaveBeenCalled();
  });
});
