import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Table } from '../tables/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Table])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

