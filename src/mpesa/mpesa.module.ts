import { Module } from '@nestjs/common';
import { MpesaService } from './mpesa.services';
import { MpesaController } from './mpesa.cpntroller';

@Module({
  controllers: [MpesaController],
  providers: [MpesaService],
  exports: [MpesaService],
})
export class MpesaModule {}