import { HttpModule, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ZipController } from './zip.controller';
import { ZipService } from './zip.service';
import * as request from 'supertest';

describe('Zip Controller', () => {
  let controller: ZipController;
  let app: INestApplication;
  let zipService = {
    getAddressByZipCode: () => ({
      cep: '12927-012',
      logradouro: 'Rua Herculano Augusto de Toledo',
      complemento: '',
      bairro: 'Núcleo Residencial Henedina Rodrigues Cortez',
      localidade: 'Bragança Paulista',
      uf: 'SP',
      ibge: '3507605',
      gia: '2252',
      ddd: '11',
      siafi: '6251',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZipController],
      providers: [ZipService],
      imports: [HttpModule],
    })
      .overrideProvider(ZipService)
      .useValue(zipService)
      .compile();

    app = await module.createNestApplication();
    controller = module.get<ZipController>(ZipController);

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a valid address by controller', async () => {
    controller.getZipCode('12927012').then(res => {
      expect(res).toBeDefined();
      expect(res).toHaveProperty('localidade', 'Bragança Paulista');
    });
  });

  it('/GET should return a valid address', async () => {
    return request(app.getHttpServer())
      .get('/api/v1/cep?cep=12927-012')
      .expect(200)
      .expect(zipService.getAddressByZipCode());
  });

  it('/GET should return a invalid request', async () => {
    return request(app.getHttpServer())
      .get('/api/v1/cep?cep=129270122')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Please enter a valid zip code',
        error: 'Bad Request',
      });
  });

  it('/GET should return a invalid request / internal server error', async () => {
    // return request(app.getHttpServer())
    //   .get('/api/v1/cep?cep=129270-122')
    //   .expect(500)
    //   .expect({
    //     status: 500,
    //     error: 'There was an internal server problem at the time',
    //   });
  });

  afterAll(async () => {
    await app.close();
  });
});
