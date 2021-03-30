import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { jwtConfiguration } from '@config';
import { User, UsersModule } from '@users';

import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfiguration),
    // ---- JWT Config ----
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      inject: [jwtConfiguration.KEY],
      useFactory: async (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        secret: jwtConfig.accessTokenSecret,
        signOptions: {
          expiresIn: jwtConfig.accessTokenExpirationTime,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
