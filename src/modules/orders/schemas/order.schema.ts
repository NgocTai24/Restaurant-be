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

  @Prop({ default: 'PENDING' }) // hoặc PENDING, CONFIRMED, CANCELLED, COMPLETED
  status: string;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
