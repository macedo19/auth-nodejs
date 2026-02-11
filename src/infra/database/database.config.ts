import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  mysql: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    options: {
      requestTimeout: 50000,
    },
  },
}));
