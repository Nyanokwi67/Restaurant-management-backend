// src/mpesa/mpesa.module.ts

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';

@Module({
  imports: [AuthModule],
  controllers: [MpesaController],
  providers: [MpesaService],
})
export class MpesaModule {}

