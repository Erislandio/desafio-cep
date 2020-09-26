import {
    CacheInterceptor,
    Controller,
    Get,
    HttpCode,
    Inject,
    InternalServerErrorException,
    Logger,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiHeaders,
    ApiQuery,
    ApiResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { IZip } from './interfaces/zip.interfaces';
import { ZipValidatorPipe } from './validators/zip.validator';
import { ZipService } from './zip.service';

@ApiHeaders([
    {
        name: 'apiKey',
        allowEmptyValue: false,
        required: true,
        description: 'Authentication api tkey',
    },
])
@Controller('/api/v1')
@ApiTags('CEP api')
@ApiSecurity('apiKey')
export class ZipController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly zipService: ZipService,
    ) {}

    @Get('/pvt/cep')
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
    @UseInterceptors(CacheInterceptor) // cache controll
    public async getZipCode(
        @Query('cep', new ZipValidatorPipe(new Logger())) zip: string,
    ): Promise<IZip> {
        try {
            return this.zipService.getAddressByZipCode(zip);
        } catch (error) {
            this.logger.error(
                `/GET cep?=${zip} - ZipController`,
                ZipController.name,
            );

            throw new InternalServerErrorException(error);
        }
    }

    @Get('/cep/check')
    @HttpCode(200)
    public async checkStatus() {
        try {
            const data = this.zipService.getAddressByZipCode('12927012');

            if (data) {
                return {
                    ok: true,
                    error: null,
                };
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
