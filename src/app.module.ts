import {
    CacheInterceptor,
    CacheModule,
    HttpModule,
    Logger,
    MiddlewareConsumer,
    Module,
} from '@nestjs/common';
import { ZipController } from './zip/zip.controller';
import { ZipService } from './zip/zip.service';
import { ZipModule } from './zip/zip.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './zip/middlewares/auth.middleware';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
    imports: [
        ZipModule,
        HttpModule,
        CacheModule.register({
            ttl: 10,
            max: 10,
        }),
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        WinstonModule.forRoot({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'api-service' },
            transports: [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'logs/debug.log',
                    level: 'debug',
                }),
            ],
        }),
    ],
    controllers: [ZipController],
    providers: [
        Logger,
        ZipService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('/api/v1/pvt');
    }
}
