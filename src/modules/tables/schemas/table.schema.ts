import { TableStatus } from '@/modules/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';



export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Prop()
  capacity: number;

  @Prop()
  location: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);

export { TableStatus };
