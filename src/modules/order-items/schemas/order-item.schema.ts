import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItem: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number; // đơn giá tại thời điểm đặt hàng

  @Prop()
  note: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
