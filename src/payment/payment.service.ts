
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    this.logger.log(`Creating payment for order ${createPaymentDto.orderId}`);

    const payment = this.paymentRepository.create(createPaymentDto);
    const savedPayment = await this.paymentRepository.save(payment);

    this.logger.log(`Payment created: ID ${savedPayment.id}`);
    return savedPayment;
  }

  async findAll() {
    this.logger.log('Fetching all payments');
    return await this.paymentRepository.find({
      relations: ['order'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByOrder(orderId: number) {
    this.logger.log(`Fetching payments for order ${orderId}`);
    return await this.paymentRepository.find({
      where: { orderId },
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: number) {
    this.logger.log(`Fetching payment with ID: ${id}`);

    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) {
      this.logger.warn(`Payment not found: ID ${id}`);
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    this.logger.log(`Updating payment: ID ${id}`);

    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);

    const updatedPayment = await this.paymentRepository.save(payment);
    this.logger.log(`Payment updated: ID ${id}`);

    return updatedPayment;
  }

  async remove(id: number) {
    this.logger.log(`Deleting payment: ID ${id}`);

    const payment = await this.findOne(id);
    await this.paymentRepository.delete(id);

    this.logger.log(`Payment deleted: ID ${id}`);
    return { message: 'Payment deleted successfully' };
  }
}