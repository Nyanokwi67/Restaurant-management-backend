
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  category: string; // 'Inventory' | 'Utilities' | 'Salaries' | 'Maintenance' | 'Other'

  @Column()
  submittedBy: string; // Name of person who submitted

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending' | 'approved' | 'rejected'

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  approvedBy: string; // Name of admin/manager who approved

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}