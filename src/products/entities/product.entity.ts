import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' }) id: number;

  @Column({ type: 'varchar', length: 32, name: 'name' }) name: string;

  @Column({ type: 'int', name: 'quantity' }) quantity: number;

  @Column({ type: 'numeric', name: 'price', precision: 7, scale: 2 })
  price: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'update_time',
  })
  updateTime: Date;
}
