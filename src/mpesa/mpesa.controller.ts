// src/mpesa/mpesa.controller.ts

import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { MpesaService } from './mpesa.service';  // ✅ Fixed path
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';  // ✅ Fixed path

@Controller('mpesa')
export class MpesaController {
  private readonly logger = new Logger(MpesaController.name);

  constructor(private readonly mpesaService: MpesaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stk-push')
  async initiateSTKPush(@Body() body: { phoneNumber: string; amount: number; orderId: number }) {
    this.logger.log(`POST /mpesa/stk-push - Phone: ${body.phoneNumber}, Amount: ${body.amount}`);
    
    const { phoneNumber, amount, orderId } = body;
    return await this.mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      `Order-${orderId}`,
      `Payment for Order #${orderId}`,
    );
  }

  @Post('callback')
  async handleCallback(@Body() callbackData: any) {
    this.logger.log('POST /mpesa/callback - Received M-Pesa callback');
    
    const result = await this.mpesaService.handleCallback(callbackData);
    console.log('Callback Result:', result);
    return { ResultCode: 0, ResultDesc: 'Success' };
  }
}
