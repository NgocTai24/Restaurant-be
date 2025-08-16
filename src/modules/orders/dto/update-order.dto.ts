import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsArray, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { OrderStatus } from '@/modules/enums';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsArray({ message: "Items phải là mảng!" })
  @IsMongoId({ each: true, message: "Mỗi item phải là ID hợp lệ của MenuItem!" })
  items?: string[];

  @IsOptional()
  totalAmount?: number;

  @IsEnum(OrderStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: OrderStatus;

  @IsOptional()
  notes?: string;
}