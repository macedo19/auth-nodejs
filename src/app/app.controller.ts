import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly servicoApp: AppService) {}

  @Get()
  obterOla(): string {
    return this.servicoApp.obterOla();
  }
}
