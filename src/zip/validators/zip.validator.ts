import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ZipValidatorPipe implements PipeTransform {
  transform(zip: string): string {
    const valid = /[0-9]{5}-[\d]{3}/g;

    const result = valid.test(zip);

    if (!result) {
      throw new BadRequestException('Please enter a valid zip code');
    }

    return zip.replace(/\-/gi, '');
  }
}
