import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId;

  @Prop()
  bookingTime: Date;

  @Prop()
  note: string;

  @Prop({ default: 'pending' }) // pending, confirmed, cancelled
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
