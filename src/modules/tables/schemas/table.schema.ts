import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 'available' }) // available, reserved, occupied
  status: string;

  @Prop()
  capacity: number;

  @Prop()
  location: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
