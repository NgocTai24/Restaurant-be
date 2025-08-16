import { IsMongoId, IsNotEmpty, IsOptional, IsArray } from "class-validator";

export class CreateOrderDto {

  @IsArray({ message: "Items phải là mảng!" })
  @IsMongoId({ each: true, message: "Mỗi item phải là ID hợp lệ của MenuItem!" })
  items: string[];

  @IsNotEmpty({ message: "totalAmount không được để trống!" })
  totalAmount: number;

  @IsOptional()
  notes?: string;

}