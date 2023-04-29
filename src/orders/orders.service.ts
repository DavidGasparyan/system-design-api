import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { Stripe } from 'stripe';
import { StripeService } from '../modules/stripe/stripe.service';
import { PaymentIntentEvent } from '../common/enums/payment-intent-event.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    customer: Customer,
  ): Promise<Order> {
    const productIds = createOrderDto.orderDetails.map(
      (item) => item.productId,
    );

    const products = await this.productsService.checkIfProductsExist(
      productIds,
    );

    if (!products || products.length != productIds.length) {
      throw new UnprocessableEntityException(
        'The order could not be processed',
      );
    }

    const order = new Order({
      customerId: customer.id,
      totalAmount: createOrderDto.totalAmount,
    });

    order.orderDetails = createOrderDto.orderDetails;

    const savedOrder = await this.ordersRepository.save(order);
    const paymentIntent = await this.stripeService.createPaymentIntent(
      savedOrder.id,
      savedOrder.totalAmount,
    );
    const clientSecret = paymentIntent.client_secret;
    const updatedOrder = { ...savedOrder, clientSecret: clientSecret };
    return updatedOrder;
  }

  async findOrder(id: string): Promise<Order> {
    return await this.ordersRepository.findOneByOrFail({ id });
  }

  async updateOrder(id: string, order: Order): Promise<UpdateResult> {
    await this.findOrder(id);
    return await this.ordersRepository.update(id, order);
  }

  async updatePaymentStatus(event: Stripe.Event): Promise<string> {
    const orderId = event.data.object['metadata'].orderId;
    const order = await this.findOrder(orderId);

    switch (event.type) {
      case PaymentIntentEvent.Succeeded:
        order.paymentStatus = PaymentStatus.Succeeded;
        break;

      case PaymentIntentEvent.Processing:
        order.paymentStatus = PaymentStatus.Processing;
        break;

      case PaymentIntentEvent.Failed:
        order.paymentStatus = PaymentStatus.Failed;
        break;

      default:
        order.paymentStatus = PaymentStatus.Created;
        break;
    }

    const updateResult = await this.updateOrder(orderId, order);

    if (updateResult.affected === 1) {
      return `Record successfully updated with Payment Status ${order.paymentStatus}`;
    } else {
      throw new UnprocessableEntityException(
        'The payment was not successfully updated',
      );
    }
  }
}
