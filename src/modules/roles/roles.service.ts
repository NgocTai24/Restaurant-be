import { RolesModule } from './roles.module';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly mailerService: MailerService
  ) { }

  // check role
  isRoleExits = async (name: string) => {
    const role = await this.roleModel.exists({ name });
    if (role) return true;
    return false;
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name, description } = createRoleDto;
    const isExits = await this.isRoleExits(name);
    if (isExits) {
      throw new BadRequestException(`Role ${name} đã tồn tại, vui lòng chọn role khác `)
    }
    const role = await this.roleModel.create({
      name, description
    })
    return {
      _id: role._id,
      name: role.name,
      description: role.description
    }
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
