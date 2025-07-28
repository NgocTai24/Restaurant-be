import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubcategoryDocument = HydratedDocument<Subcategory>;

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ required: true })
  name: string; 

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
