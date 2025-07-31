import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrderDto {

  @IsMongoId({ message: "User không được để trống!" })
  user: string;

  @IsMongoId({ message: "itemsMenu không được để trống!" })
  items: string;

  @IsNotEmpty({ message: "totalAmount Không được để trống !" })
  totalAmount: number;

  @IsOptional()
  notes: string;

}
