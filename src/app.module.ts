import { HttpModule, Module } from '@nestjs/common';
import { ZipController } from './zip/zip.controller';
import { ZipService } from './zip/zip.service';
import { ZipModule } from './zip/zip.module';

@Module({
  imports: [ZipModule, HttpModule],
  controllers: [ZipController],
  providers: [ZipService],
})
export class AppModule {}
