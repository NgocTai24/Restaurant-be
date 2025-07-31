import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderStatus } from '@/modules/enums';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

  @IsOptional()
  items: string;

  @IsOptional()
  totalAmount: number;

  @IsEnum(OrderStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: OrderStatus;


  @IsOptional()
  notes: string;
}
