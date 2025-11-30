import { IsNumber, IsString, IsNotEmpty, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  tableId: number;

  @IsNumber()
  tableNumber: number;

  @IsNumber()
  waiterId: number;

  @IsString()
  @IsNotEmpty()
  waiterName: string;

  @IsString()
  @IsNotEmpty()
  items: string; // JSON string of order items

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(['open', 'paid'])
  @IsOptional()
  status?: 'open' | 'paid';

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}