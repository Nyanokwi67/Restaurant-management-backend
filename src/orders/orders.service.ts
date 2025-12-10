// src/orders/orders.service.ts

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Table } from '../tables/entities/table.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    this.logger.log(`Creating new order for table ${createOrderDto.tableId}`);

    try {
      // Validate and get table
      const table = await this.tableRepository.findOne({
        where: { id: createOrderDto.tableId },
      });

      if (!table) {
        throw new NotFoundException(`Table with ID ${createOrderDto.tableId} not found`);
      }

      // Validate and get waiter
      const waiter = await this.userRepository.findOne({
        where: { id: createOrderDto.waiterId },
      });

      if (!waiter) {
        throw new NotFoundException(`Waiter with ID ${createOrderDto.waiterId} not found`);
      }

      // Parse and validate items
      const items = JSON.parse(createOrderDto.items);
      
      if (items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      // Create order
      const order = this.orderRepository.create({
        tableId: createOrderDto.tableId,
        waiterId: createOrderDto.waiterId,
        items: createOrderDto.items,
        total: createOrderDto.total,
        status: createOrderDto.status || 'open',
        paymentMethod: createOrderDto.paymentMethod,
      });

      const savedOrder = await this.orderRepository.save(order);
      this.logger.log(`Order created successfully: ID ${savedOrder.id}`);

      // Update table status to occupied
      await this.tableRepository.update(createOrderDto.tableId, {
        status: 'occupied',
      });
      this.logger.log(`Table ${createOrderDto.tableId} marked as occupied`);

      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Fetching all orders');

    const orders = await this.orderRepository.find({
      relations: ['waiter', 'table'],
      order: { timestamp: 'DESC' },
    });

    return orders.map(order => ({
      id: order.id,
      tableId: order.tableId,
      tableNumber: order.table.number,
      waiterId: order.waiterId,
      waiterName: order.waiter.name,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      timestamp: order.timestamp,
    }));
  }

  async findOne(id: number) {
    this.logger.log(`Fetching order with ID: ${id}`);

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['waiter', 'table'],
    });

    if (!order) {
      this.logger.warn(`Order not found: ID ${id}`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      id: order.id,
      tableId: order.tableId,
      tableNumber: order.table.number,
      waiterId: order.waiterId,
      waiterName: order.waiter.name,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      timestamp: order.timestamp,
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    this.logger.log(`Updating order: ID ${id}`);

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    Object.assign(order, updateOrderDto);

    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log(`Order updated: ID ${id}`);

    // If order is being marked as paid/closed, free up the table
    if (updateOrderDto.status === 'paid' || updateOrderDto.status === 'closed') {
      await this.tableRepository.update(order.tableId, {
        status: 'free',
      });
      this.logger.log(`Table ${order.tableId} marked as free`);
    }

    return updatedOrder;
  }

  async remove(id: number) {
    this.logger.log(`Deleting order: ID ${id}`);

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.orderRepository.delete(id);

    // Free up the table
    await this.tableRepository.update(order.tableId, {
      status: 'free',
    });
    this.logger.log(`Order deleted: ID ${id}, Table ${order.tableId} freed`);

    return { message: 'Order deleted successfully' };
  }
}