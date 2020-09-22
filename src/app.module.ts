import { Module } from '@nestjs/common';
import { CepController } from './cep/cep.controller';
import { CepService } from './cep/cep.service';
import { CepModule } from './cep/cep.module';

@Module({
  imports: [CepModule],
  controllers: [CepController],
  providers: [CepService],
})
export class AppModule {}
