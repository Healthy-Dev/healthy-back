import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { json } from 'body-parser';
import { urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, transform: true, validationError: {target: false, value: false}}),
  );

  app.use(
    json({
      limit: '20mb',
    }),
  );
  app.use(
    urlencoded({
      limit: '20mb',
      extended: true,
    }),
  );

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter(app));
  await app.listen(port);
}
bootstrap();
