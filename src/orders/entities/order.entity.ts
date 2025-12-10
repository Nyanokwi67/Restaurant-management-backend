// src/orders/entities/order.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Table } from '../../tables/entities/table.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table, (table) => table.orders)
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @Column()
  tableId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'waiterId' })
  waiter: User;

  @Column()
  waiterId: number;

  @Column('text')
  items: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'open',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: null,
  })
  paymentMethod: string;

  // One Order has Many Payments
  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn()
  timestamp: Date;
}