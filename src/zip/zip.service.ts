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

  public async getAddressByZipCode(zip: string): Promise<IZip> {
    try {
      const response = await this.httpService.get<IZip>(this.route(zip));

      const { data, status } = await response.toPromise();

      return data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was an internal server problem at the time',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private route = (zip: string): string => {
    return `https://viacep.com.br/ws/${zip}/json`;
  };
}
