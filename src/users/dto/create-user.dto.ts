import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['admin', 'manager', 'waiter'])
  role: 'admin' | 'manager' | 'waiter';

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}