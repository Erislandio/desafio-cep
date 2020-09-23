import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ZipController } from './zip.controller';

describe('ZipController', () => {
  let controller: ZipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZipController],
      imports: [HttpModule],
    }).compile();

    controller = module.get<ZipController>(ZipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();

    controller.getZipCode('129270-12').then(res => {
      console.log(res);
    });
  });
});
