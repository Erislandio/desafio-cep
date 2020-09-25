import { IZip } from './zip.interfaces';

export class Zip {
    getAddressByZipCode: (zip: string) => Promise<IZip>;
}
