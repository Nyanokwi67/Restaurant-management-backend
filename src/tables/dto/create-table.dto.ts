import { IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateTableDto {
  @IsNumber()
  @Min(1)
  number: number;

  @IsNumber()
  @Min(1)
  seats: number;

  @IsEnum(['free', 'occupied'])
  @IsOptional()
  status?: 'free' | 'occupied';
}