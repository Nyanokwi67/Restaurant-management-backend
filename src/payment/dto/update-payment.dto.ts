
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'failed'])
  status?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}