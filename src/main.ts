import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

(async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

    app.use(
        rateLimit({
            // request limit
            max: 100,
        }),
    );
    app.enableCors();

    const docs = new DocumentBuilder() // docs/swagger controll
        .setTitle('CEP api')
        .setDescription(
            'With this api we can make zip code queries throughout the Brazilian territory',
        )
        .setVersion('1.0')
        .addApiKey({
            type: 'apiKey',
            name: 'apiKey',
            description: 'Authentication token',
        })
        .build();

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // logger controll
    const document = SwaggerModule.createDocument(app, docs);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
})();
