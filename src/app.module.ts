import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

import {
  appConfiguration,
  databaseConfiguration,
  emailConfiguration,
} from '@config';
import { Environment } from '@common/constants';
import { AuthModule } from '@auth';
import { UsersModule } from '@users';
import { EmailModule } from '@email';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ---- Config ----
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfiguration, databaseConfiguration, emailConfiguration],
      validationSchema: Joi.object({
        APP_ENV: Joi.string().default(Environment.Development),
        APP_NAME: Joi.string().default('ThingsHub'),
        APP_PORT: Joi.string().default(3000),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    // ---- TypeOrm ----
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfiguration.KEY],
      useFactory: (database: ConfigType<typeof databaseConfiguration>) => ({
        type: database.driver as 'postgres',
        host: database.host,
        port: +database.port,
        database: database.name,
        username: database.username,
        password: database.password,
        autoLoadEntities: true,
        synchronize: true, // 👈 your entities will be synced with the database (ORM will map entity definitions to corresponding SQL tabled), every time you run the application (recommended: disable in the production)
      }),
    }),
    // ---- Email ----
    EmailModule.forRoot({
      imports: [ConfigModule],
      inject: [emailConfiguration.KEY],
      useFactory: (email: ConfigType<typeof emailConfiguration>) => ({
        service: email.service,
        user: email.user,
        password: email.password,
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
