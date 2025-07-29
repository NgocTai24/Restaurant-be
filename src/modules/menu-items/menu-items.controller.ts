import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) { }

  @Post()
  @Public()
  @Roles()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Patch()
  @Public()
  update(@Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsService.update(updateMenuItemDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(id);
  }
}
