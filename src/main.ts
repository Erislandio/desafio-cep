import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.use(
    rateLimit({
      max: 100,
    }),
  );
  app.enableCors();

  const docs = new DocumentBuilder()
    .setTitle('CEP api')
    .setDescription(
      'With this api we can make zip code queries throughout the Brazilian territory',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docs);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
})();
