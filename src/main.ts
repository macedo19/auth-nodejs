import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuracaoSwagger = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription(
      'API de autenticação e gerenciamento de usuários - Teste Técnico',
    )
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const documentoSwagger = SwaggerModule.createDocument(
    app,
    configuracaoSwagger,
  );
  SwaggerModule.setup('api', app, documentoSwagger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
