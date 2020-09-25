import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthValidatorPipe implements PipeTransform {
    transform(auth: string): string {
        console.log(auth);
        return '';
    }
}
