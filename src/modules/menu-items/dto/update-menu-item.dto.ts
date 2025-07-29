import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  price: number;

  @IsOptional()
  isAvailable: string;

  @IsOptional()
  image: string;
}
