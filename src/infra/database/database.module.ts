import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      inject: [ConfigService],
      useFactory: (servicoConfiguracao: ConfigService) => {
        const configBanco = servicoConfiguracao.get('database.mysql');
        return {
          type: configBanco.type,
          host: configBanco.host,
          port: configBanco.port,
          username: configBanco.username,
          password: configBanco.password,
          database: configBanco.database,
          autoLoadEntities: true,
          synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
          logging: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
