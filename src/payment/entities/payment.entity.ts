
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  method: string; // 'cash' | 'mpesa' | 'card'

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending' | 'completed' | 'failed'

  @Column({ nullable: true })
  transactionId: string; // M-Pesa receipt number or card transaction ID

  @Column({ nullable: true })
  phoneNumber: string; // For M-Pesa payments

  @CreateDateColumn()
  timestamp: Date;
}