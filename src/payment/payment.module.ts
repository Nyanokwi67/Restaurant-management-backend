// src/payments/payments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PaymentsController } from './payment.controller';
import { PaymentsService } from './payment.service';
import { PaystackService } from '../paystack/paystack.service'; 
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackService], 
  exports: [PaymentsService],
})
export class PaymentsModule {}