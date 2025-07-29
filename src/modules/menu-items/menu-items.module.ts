import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { Subcategory, SubcategorySchema } from '../subcategory/schemas/subcategory.schema';

@Module({
  imports: [
        MongooseModule.forFeature([
          { name: MenuItem.name, schema: MenuItemSchema},
          { name: Subcategory.name, schema: SubcategorySchema }
        ])
      ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MongooseModule],
})
export class MenuItemsModule { }
