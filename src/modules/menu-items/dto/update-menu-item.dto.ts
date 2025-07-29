import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {

  @IsMongoId({ message: "Id khong hop le" })
  @IsNotEmpty({ message: "Id khong duoc de trong !" })
  _id: string;

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
