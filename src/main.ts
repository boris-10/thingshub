import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

import { appConfiguration } from '@config';
import { APP_CONFIG } from '@common/constants';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  // ---- Pipes ----
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(errors),
    }),
  );

  // ---- Swagger ----
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ThingsHub')
    .setDescription('All things in one place')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api/v1/docs', app, document);

  // ---- Config ----
  const configService = app.get<ConfigService>(ConfigService);
  const appConfig = configService.get<ConfigType<typeof appConfiguration>>(
    APP_CONFIG,
  );
  await app.listen(appConfig.port);
}
bootstrap();
