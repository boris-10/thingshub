import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(errors),
    }),
  );

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ThingsHub')
    .setDescription('All things in one place')
    .setVersion('1.0')
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: true,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
