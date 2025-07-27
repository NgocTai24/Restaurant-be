import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Subcategory.name, schema: SubcategorySchema}])],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService]
})
export class SubcategoryModule {}
