// src/payments/payments.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('admin', 'manager', 'waiter')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log('POST /payments');
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles('admin', 'manager')
  findAll() {
    this.logger.log('GET /payments');
    return this.paymentsService.findAll();
  }

  @Get('order/:orderId')
  @Roles('admin', 'manager', 'waiter')
  findByOrder(@Param('orderId') orderId: string) {
    this.logger.log(`GET /payments/order/${orderId}`);
    return this.paymentsService.findByOrder(+orderId);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /payments/${id}`);
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    this.logger.log(`PATCH /payments/${id}`);
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /payments/${id}`);
    return this.paymentsService.remove(+id);
  }
}