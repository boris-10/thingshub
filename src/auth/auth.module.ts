import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import jtwConfig from '../config/jwt.config';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jtwConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
