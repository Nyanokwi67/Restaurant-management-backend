// backend/src/payment/payment.controller.ts - M-PESA FIX

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
import { PaystackService } from '../paystack/paystack.service';
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

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paystackService: PaystackService,
  ) {}

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

  // ✅ FIXED: Initialize Paystack payment with proper M-Pesa support
  @Post('paystack/initialize')
  @Roles('admin', 'manager', 'waiter')
  async initializePaystackPayment(@Body() body: {
    orderId: number;
    email: string;
    amount: number;
    channel?: 'card' | 'mobile_money';
    phoneNumber?: string;
  }) {
    this.logger.log('POST /payments/paystack/initialize');
    this.logger.log(`Request body: ${JSON.stringify(body)}`);
    
    try {
      const reference = `ORDER_${body.orderId}_${Date.now()}`;
      const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback?orderId=${body.orderId}`;
      
      // ✅ Determine channels
      let channels: string[];
      if (body.channel === 'card') {
        channels = ['card'];
      } else if (body.channel === 'mobile_money') {
        channels = ['mobile_money'];
      } else {
        channels = ['card', 'mobile_money'];
      }

      // ✅ CRITICAL FIX: Paystack expects phone in specific format
      const metadata: any = { 
        orderId: body.orderId,
        cancel_action: callbackUrl,
      };

      // ✅ Add phone to metadata for M-Pesa
      if (body.channel === 'mobile_money' && body.phoneNumber) {
        // Paystack expects phone in custom_fields
        metadata.custom_fields = [
          {
            display_name: "Phone Number",
            variable_name: "phone_number", 
            value: body.phoneNumber, // Must be in format: 254708374149
          }
        ];
      }

      this.logger.log(`Channels: ${JSON.stringify(channels)}`);
      this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);
      
      const paystackResponse = await this.paystackService.initializeTransaction(
        body.email,
        body.amount,
        reference,
        metadata,
        callbackUrl,
        channels,
      );

      return {
        success: true,
        authorization_url: paystackResponse.authorization_url,
        access_code: paystackResponse.access_code,
        reference: paystackResponse.reference,
      };
    } catch (error) {
      this.logger.error('Paystack initialization error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Verify Paystack payment
  @Get('paystack/verify/:reference')
  @Roles('admin', 'manager', 'waiter')
  async verifyPaystackPayment(@Param('reference') reference: string) {
    this.logger.log(`GET /payments/paystack/verify/${reference}`);
    try {
      const verification = await this.paystackService.verifyTransaction(reference);

      if (verification.status === 'success') {
        return {
          success: true,
          message: 'Payment verified successfully',
          data: {
            reference: verification.reference,
            amount: verification.amount,
            status: verification.status,
            metadata: verification.metadata,
          },
        };
      } else {
        return {
          success: false,
          message: 'Payment not successful',
        };
      }
    } catch (error) {
      this.logger.error('Paystack verification error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}