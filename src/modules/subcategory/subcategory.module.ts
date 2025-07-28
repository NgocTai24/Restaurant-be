import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Subcategory.name, schema: SubcategorySchema},
        { name: Category.name, schema: CategorySchema }
      ])
    ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService]
})
export class SubcategoryModule {}
