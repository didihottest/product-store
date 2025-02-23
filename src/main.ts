import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const uploadDir = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
