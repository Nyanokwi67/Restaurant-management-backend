// src/payments/dto/create-payment.dto.ts

import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'mpesa', 'card'])
  method: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'failed'])
  status?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}