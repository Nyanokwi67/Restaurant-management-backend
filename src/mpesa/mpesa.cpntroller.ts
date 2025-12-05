import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MpesaService } from './mpesa.services';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stk-push')
  async initiateSTKPush(@Body() body: { phoneNumber: string; amount: number; orderId: number }) {
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
    const result = await this.mpesaService.handleCallback(callbackData);
    console.log('Callback Result:', result);
    return { ResultCode: 0, ResultDesc: 'Success' };
  }
}