import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './common/config/env.validation';
import { CustomersModule } from './customers/customers.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { AuthModule } from './modules/auth/auth.module';
import dbConfig from './common/config/db.config';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    CustomersModule,
    OrderDetailsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
