import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from 'src/infra/infra.module';
import { DatabaseConfig } from 'src/infra/database/database.config';
import 'dotenv/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

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
  providers: [AppService],
})
export class AppModule {}
