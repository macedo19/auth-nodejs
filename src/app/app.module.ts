import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from 'src/infra/infra.module';
import { DatabaseConfig } from 'src/infra/database/database.config';
import 'dotenv/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from 'src/modules/auth/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    InfraModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/lista-usuarios', method: RequestMethod.GET });
  }
}
