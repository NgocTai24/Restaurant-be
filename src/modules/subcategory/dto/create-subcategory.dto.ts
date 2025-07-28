import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateSubcategoryDto {
  @IsNotEmpty({ message: "Name khong duoc de trong !" })
  name: string;

  @IsMongoId({ message: "Category khong duoc de trong !" })
  category: string;
}
