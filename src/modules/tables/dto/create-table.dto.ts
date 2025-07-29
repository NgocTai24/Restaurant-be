import { IsNotEmpty, IsEnum, IsOptional} from 'class-validator';
import { TableStatus } from '../Enum/status';


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