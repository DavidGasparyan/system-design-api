import { DataSource } from 'typeorm';
import { OrderDetail } from './src/order-details/entities/order-detail.entity';
import { Order } from './src/orders/entities/order.entity';
import { Customer } from './src/customers/entities/customer.entity'
import { Product } from './src/products/entities/product.entity';
import { AddPaymentStatusToOrders1652272019740 } from './src/db/migrations/1676630917512-AddPaymentStatusToOrders';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_MAIN_HOST'),
  port: configService.get('DB_MAIN_PORT'),
  username: configService.get('DB_MAIN_USER'),
  password: configService.get('DB_MAIN_PASSWORD'),
  database: configService.get('DB_MAIN_DATABASE'),
  entities: [Order, OrderDetail, Product, Customer],
  migrations: [AddPaymentStatusToOrders1652272019740],
  // entities: [],
});