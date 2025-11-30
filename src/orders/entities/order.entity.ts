import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Table } from '../../tables/entities/table.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @Column()
  tableNumber: number;

  @Column()
  waiterId: number;

  @Column({ length: 100 })
  waiterName: string;

  @Column('text')
  items: string; // We'll store order items as JSON string

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: 'open'
  })
  status: 'open' | 'paid';

  @Column({ length: 20, nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  timestamp: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'waiterId' })
  waiter: User;

  @ManyToOne(() => Table, { nullable: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;
}