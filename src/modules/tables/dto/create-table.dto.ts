import { TableStatus } from '@/modules/enums';
import { IsNotEmpty, IsEnum, IsOptional} from 'class-validator';



export class CreateTableDto {
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