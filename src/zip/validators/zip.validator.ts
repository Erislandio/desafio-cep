import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ZipValidatorPipe implements PipeTransform {
  transform(zip: string): string {
    const valid = /[0-9]{8}/g;

    const result = valid.test(zip);

    if (!result || zip.length > 8) {
      throw new BadRequestException('Please enter a valid zip code');
    }

    return zip.replace(/\-/gi, '');
  }
}
