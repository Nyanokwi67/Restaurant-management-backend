// src/tables/entities/table.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: number;

  @Column()
  seats: number;

  @Column({ 
    type: 'varchar',
    length: 20,
    default: 'free' 
  })
  status: string;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}