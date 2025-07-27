import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatisticDocument = HydratedDocument<Statistic>;

@Schema({ timestamps: true })
export class Statistic {
  @Prop()
  date: Date;

  @Prop()
  totalRevenue: number;

  @Prop()
  totalOrders: number;

  @Prop()
  totalCustomers: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
