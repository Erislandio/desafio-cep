import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ZipService } from './zip.service';
import { ZipController } from './zip.controller';

@Module({
    imports: [HttpModule, CacheModule.register()], // cache-controll
    controllers: [ZipController],
    providers: [ZipService],
})
export class ZipModule {}
