import { Body, Controller, Get, Query, UsePipes } from '@nestjs/common';
import { IZip } from './interfaces/zip.interfaces';
import { ZipValidatorPipe } from './validators/zip.validator';
import { ZipService } from './zip.service';

@Controller('/api/v1/cep')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Get()
  @UsePipes()
  public async getZipCode(
    @Query('cep', new ZipValidatorPipe()) zip: string,
  ): Promise<IZip> {
    return this.zipService.getAddressByZipCode(zip);
  }
}
