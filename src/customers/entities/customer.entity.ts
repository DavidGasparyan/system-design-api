import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../../orders/entities/order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Exclude()
  @Column({ name: 'password_digest', type: 'varchar' })
  password: string;

  @Exclude()
  confirmPassword: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: 'now()',
    readonly: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: 'now()',
  })
  updatedAt: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  constructor(data: Partial<Customer> = null) {
    if (data !== null) {
      Object.assign(this, data);
    }
  }
}
