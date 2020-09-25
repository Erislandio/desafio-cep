import {
    CacheInterceptor,
    CacheModule,
    HttpModule,
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
    ],
    controllers: [ZipController],
    providers: [
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
