import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50 })
  category: string;

  @Column({ length: 100 })
  submittedBy: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'datetime' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}