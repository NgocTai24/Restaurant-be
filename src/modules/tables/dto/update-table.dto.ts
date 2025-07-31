import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { TableStatus } from '@/modules/enums';


export class UpdateTableDto extends PartialType(CreateTableDto) {

  @IsNotEmpty({ message: 'Tên bàn không được để trống' })
  name: string;

  @IsOptional()
  description: string;

  @IsEnum(TableStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: TableStatus;

  @IsOptional()
  capacity?: number;

  @IsOptional()
  location: string;

}
