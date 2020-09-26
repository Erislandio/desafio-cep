import {
    PipeTransform,
    Injectable,
    BadRequestException,
    Logger,
    Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ZipValidatorPipe implements PipeTransform {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    transform(zip: string): string {
        const valid = /[0-9]{8}/g;

        const result = valid.test(zip);

        if (!result || zip.length > 8) {
            this.logger.error(
                `Zip MiddleWare validation - Please enter a valid zip code - zip: ${zip} `,
                ZipValidatorPipe.name,
            );
            throw new BadRequestException('Please enter a valid zip code');
        }

        this.logger.debug(
            `/GET cep?=${zip} - ZipValidatorPipe - valid zip`,
            ZipValidatorPipe.name,
        );

        return zip.replace(/\-/gi, '');
    }
}
