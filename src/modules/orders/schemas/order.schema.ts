import { OrderStatus } from '@/modules/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'MenuItem' }])
  items: Types.ObjectId[];

  @Prop()
  totalAmount: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
