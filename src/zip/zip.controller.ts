import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IZip } from './interfaces/zip.interfaces';
import { ZipValidatorPipe } from './validators/zip.validator';
import { ZipService } from './zip.service';

@Controller('/api/v1/cep')
@ApiTags('CEP api')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Get()
  @UsePipes()
  @ApiResponse({
    status: 200,
  })
  @ApiQuery({
    name: 'cep',
    description: 'example: 12927-012, remember to put dashes',
    required: true,
    allowEmptyValue: false,
    type: 'string',
  })
  @ApiBadRequestResponse({
    description:
      'This error can happen when the api receives an invalid value from zip example: 12927-012',
  })
  public async getZipCode(
    @Query('cep', new ZipValidatorPipe()) zip: string,
  ): Promise<IZip> {
    return this.zipService.getAddressByZipCode(zip);
  }
}
