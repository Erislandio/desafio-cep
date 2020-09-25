import {
    CacheInterceptor,
    CacheModule,
    HttpModule,
    Module,
} from '@nestjs/common';
import { ZipController } from './zip/zip.controller';
import { ZipService } from './zip/zip.service';
import { ZipModule } from './zip/zip.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [
        ZipModule,
        HttpModule,
        CacheModule.register({
            ttl: 10,
            max: 10,
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
export class AppModule {}
