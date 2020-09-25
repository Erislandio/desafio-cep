import {
    HttpException,
    HttpService,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Zip } from './interfaces/zip.class';
import { IZip } from './interfaces/zip.interfaces';

@Injectable()
export class ZipService implements Zip {
    constructor(private readonly httpService: HttpService) {}

    private setCharAt = (
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
                    validationZip = this.setCharAt(validationZip, index, '0');
                }

                req = {
                    error: `unable to fetch the informed zip code: ${zip}`,
                };
            }

            return req;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'There was an internal server problem at the time',
                    description: error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async sendZipCode(code: string): Promise<IZip> {
        const response = await this.httpService.get<IZip>(this.route(code));

        const { data } = await response.toPromise();

        return data;
    }

    private route = (zip: string): string => {
        return `https://viacep.com.br/ws/${zip}/json`;
    };
}
