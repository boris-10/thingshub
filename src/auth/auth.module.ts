import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { emailConfiguration, jwtConfiguration } from '@config';
import { User, UsersModule } from '@users';
import { EmailModule } from '@email';

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
    // ---- Email ----
    EmailModule.forFeature({
      imports: [ConfigModule.forFeature(emailConfiguration)],
      inject: [emailConfiguration.KEY],
      useFactory: (email: ConfigType<typeof emailConfiguration>) => ({
        service: email.service,
        user: email.user,
        password: email.password,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
