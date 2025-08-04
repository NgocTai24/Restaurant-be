import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @IsNotEmpty({ message: "Name khong duoc de trong !" })
  name: string;

  @IsMongoId({ message: "Category khong duoc de trong !" })
  category: string;
}
