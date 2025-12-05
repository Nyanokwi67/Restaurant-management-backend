import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MpesaService {
  private readonly consumerKey = process.env.MPESA_CONSUMER_KEY;
  private readonly consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  private readonly shortCode = process.env.MPESA_SHORTCODE || '174379';
  private readonly passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  private readonly callbackUrl = process.env.MPESA_CALLBACK_URL || 'http://localhost:3000/api/mpesa/callback';
  private readonly environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
  private readonly useDemoMode = process.env.MPESA_DEMO_MODE === 'true';

  async initiateSTKPush(phoneNumber: string, amount: number, accountReference: string, transactionDesc: string) {
    console.log('===========================================');
    console.log('M-PESA STK PUSH REQUEST');
    console.log('Phone:', phoneNumber);
    console.log('Amount: KES', amount);
    console.log('Reference:', accountReference);
    console.log('Demo Mode:', this.useDemoMode);
    console.log('===========================================');
    
    if (this.useDemoMode) {
      console.log('USING DEMO MODE - Simulating successful payment');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: 'STK Push sent successfully (DEMO MODE)',
        data: {
          MerchantRequestID: '29115-34620561-' + Date.now(),
          CheckoutRequestID: 'ws_CO_' + Date.now(),
          ResponseCode: '0',
          ResponseDescription: 'Success. Request accepted for processing',
          CustomerMessage: 'Success. Request accepted for processing'
        },
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');

      let formattedPhone = phoneNumber.replace(/[\s+]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
        formattedPhone = '254' + formattedPhone;
      }

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      const response = await axios.post(
        `${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.trim()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('STK Push Response:', JSON.stringify(response.data, null, 2));

      return {
        success: true,
        message: 'STK Push sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
      
      throw new HttpException(
        'M-Pesa service temporarily unavailable. Please use cash or card payment.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private getBaseUrl(): string {
    return this.environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    const cleanKey = this.consumerKey?.trim();
    const cleanSecret = this.consumerSecret?.trim();
    
    const auth = Buffer.from(`${cleanKey}:${cleanSecret}`).toString('base64');
    
    const response = await axios.get(
      `${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      },
    );
    
    return response.data.access_token;
  }

  async handleCallback(callbackData: any) {
    console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;

      if (stkCallback.ResultCode === 0) {
        const callbackMetadata = stkCallback.CallbackMetadata.Item;
        const amount = callbackMetadata.find((item: any) => item.Name === 'Amount')?.Value;
        const mpesaReceiptNumber = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
        const phoneNumber = callbackMetadata.find((item: any) => item.Name === 'PhoneNumber')?.Value;

        return {
          success: true,
          resultCode: stkCallback.ResultCode,
          resultDesc: stkCallback.ResultDesc,
          amount,
          mpesaReceiptNumber,
          phoneNumber,
        };
      } else {
        return {
          success: false,
          resultCode: stkCallback.ResultCode,
          resultDesc: stkCallback.ResultDesc,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error processing callback',
      };
    }
  }
}