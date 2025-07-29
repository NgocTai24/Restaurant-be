import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateMenuItemDto {
    @IsNotEmpty({ message: "Name khong duoc de trong !" })
    name: string;
  
    @IsMongoId({ message: "subcategory khong duoc de trong !" })
    subcategory: string;
    
    @IsNotEmpty({ message: "price khong duoc de trong !" })
    price: number;
  
    description: string;

    @IsNotEmpty({ message: "image khong duoc de trong !" })
    image: string;
  
    isAvailable: string;

}
