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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    InfraModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/lista-usuarios', method: RequestMethod.GET });
  }
}
