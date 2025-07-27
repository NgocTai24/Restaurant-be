import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty({ message: "Name khong duoc de trong !" })
  name: string;

  @IsNotEmpty({ message: "Description khong duoc de trong !" })
  description: string;

}
