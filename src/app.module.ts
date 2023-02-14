import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PurchasesModule } from './purchases/purchases.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductsModule, PurchasesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
