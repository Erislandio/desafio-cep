import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.use(
    rateLimit({
      max: 100,
    }),
  );
  app.enableCors();
  await app.listen(3000);
})();
