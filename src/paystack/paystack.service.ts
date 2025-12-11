// backend/src/paystack/paystack.service.ts - UPDATED

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class PaystackService {
  private readonly secretKey: string;

  constructor() {
    const key = process.env.PAYSTACK_SECRET_KEY;
    
    if (!key) {
      throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
    }
    
    this.secretKey = key;
  }

  // ✅ UPDATED: Add channels parameter
  async initializeTransaction(
    email: string,
    amount: number,
    reference: string,
    metadata?: any,
    callbackUrl?: string,
    channels?: string[], // ✅ NEW: Payment channels
  ): Promise<any> {
    const params = JSON.stringify({
      email,
      amount: amount * 100,
      reference,
      currency: 'KES',
      metadata: metadata || {},
      callback_url: callbackUrl || 'http://localhost:5173/payment/callback',
      channels: channels || ['card', 'mobile_money'], // ✅ NEW: Specify channels
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status) {
              resolve(response.data);
            } else {
              reject(new HttpException(response.message, HttpStatus.BAD_REQUEST));
            }
          } catch (error) {
            reject(new HttpException('Payment initialization failed', HttpStatus.INTERNAL_SERVER_ERROR));
          }
        });
      });

      req.on('error', (error) => {
        reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
      });

      req.write(params);
      req.end();
    });
  }

  // Verify a transaction (unchanged)
  async verifyTransaction(reference: string): Promise<any> {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    };

    return new Promise((resolve, reject) => {
      https
        .get(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.status) {
                resolve(response.data);
              } else {
                reject(new HttpException(response.message, HttpStatus.BAD_REQUEST));
              }
            } catch (error) {
              reject(new HttpException('Payment verification failed', HttpStatus.INTERNAL_SERVER_ERROR));
            }
          });
        })
        .on('error', (error) => {
          reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });
  }
}