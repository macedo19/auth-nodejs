import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserBasicAuth } from './entity/users-basic-auth.entity';
import { UserBasicAuthRepository } from './repositories/user-basic-auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBasicAuth], 'mysql')],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IUserBasicAuthRespository',
      useClass: UserBasicAuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
