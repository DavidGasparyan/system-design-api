import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  orderDetails: OrderDetail[];
}
