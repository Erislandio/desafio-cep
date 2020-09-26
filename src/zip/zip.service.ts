import {
    HttpException,
    HttpService,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Zip } from './interfaces/zip.class';
import { IZip } from './interfaces/zip.interfaces';

@Injectable()
export class ZipService implements Zip {
    constructor(
        private readonly httpService: HttpService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    private replaceCharIndex = (
        code: string,
        index: number,
        replaceValue = '0',
    ): string => {
        if (index > code.length - 1) return code;
        return `${code.substring(0, index)}${replaceValue}${code.substring(
            index + 1,
        )}`;
    };

    public async getAddressByZipCode(zip: string): Promise<IZip> {
        try {
            let req = null;
            let validationZip = zip;

            for (let index = 7; index <= zip.length; index--) {
                const response = await this.sendZipCode(validationZip);
                req = response;

                if (!response.erro) {
                    break;
                }

                if (validationZip[index] !== '0') {
                    validationZip = this.replaceCharIndex(
                        validationZip,
                        index,
                        '0',
                    );
                }

                req = {
                    error: `unable to fetch the informed zip code: ${zip}`,
                };
            }

            return req;
        } catch (error) {
            this.logger.error(
                `Internal server error: ${error} - Status: 500 - method: getAddressByZipCode`,
                ZipService.name,
            );

            this.statusError(error);
        }
    }

    private statusError(error: any): void {
        throw new HttpException(
            {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'There was an internal server problem at the time',
                description: error,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    private async sendZipCode(code: string): Promise<IZip> {
        try {
            const response = await this.httpService.get<IZip>(this.route(code));

            const { data } = await response.toPromise();

            return data;
        } catch (error) {
            this.logger.error(
                `Internal server error: ${error} - Status: 500 - method: sendZipCode`,
                ZipService.name,
            );

            this.statusError(error);
        }
    }

    private route = (zip: string): string => {
        return `https://viacep.com.br/ws/${zip}/json`;
    };
}
