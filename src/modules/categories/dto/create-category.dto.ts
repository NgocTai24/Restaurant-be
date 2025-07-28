import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: "Name khong duoc de trong !" })
  name: string;

  @IsNotEmpty({ message: "Ảnh khong duoc de trong !" })
  image: string;
}
