import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  obterOla(): string {
    return 'Hello World!';
  }
}
