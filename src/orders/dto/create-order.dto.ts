// src/orders/dto/create-order.dto.ts

import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  tableId: number;

  @IsNotEmpty()
  @IsNumber()
  waiterId: number;

  @IsNotEmpty()
  @IsString()
  items: string;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}