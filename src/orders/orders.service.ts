import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Table } from '../tables/entities/table.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Create the order
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    // Automatically mark table as occupied
    if (createOrderDto.tableId) {
      await this.tablesRepository.update(createOrderDto.tableId, {
        status: 'occupied',
      });
      console.log(`✅ Table ${createOrderDto.tableNumber} marked as OCCUPIED`);
    }

    return savedOrder;
  }

  findAll() {
    return this.ordersRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    // If order is being marked as paid, free the table
    if (updateOrderDto.status === 'paid' && order.status === 'open') {
      await this.tablesRepository.update(order.tableId, {
        status: 'free',
      });
      console.log(`✅ Table ${order.tableNumber} marked as FREE (Order #${id} paid)`);
    }

    // Update the order
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    
    // If deleting an open order, free the table
    if (order.status === 'open') {
      await this.tablesRepository.update(order.tableId, {
        status: 'free',
      });
      console.log(`✅ Table ${order.tableNumber} marked as FREE (Order #${id} deleted)`);
    }

    await this.ordersRepository.delete(id);
    return { message: `Order #${id} deleted successfully` };
  }
}