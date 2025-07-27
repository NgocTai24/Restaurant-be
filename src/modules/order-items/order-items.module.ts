import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OrderItem.name, schema: OrderItemSchema }])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [MongooseModule],
})
export class OrderItemsModule { }
