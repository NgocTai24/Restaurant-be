import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MenuItem, MenuItemSchema } from '../menu-items/schemas/menu-item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: User.name, schema: UserSchema },
    { name: MenuItem.name, schema: MenuItemSchema }
  ])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule],
})
export class OrdersModule { }
