import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Subcategory } from '../subcategory/schemas/subcategory.schema';
import { MenuItem } from './schemas/menu-item.schema';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name) private menuModel: Model<MenuItem>,
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    private readonly mailerService: MailerService
  ) { }

  async create(createMenuItemDto: CreateMenuItemDto) {
    const { name, description, subcategory, price, image, isAvailable } = createMenuItemDto;
    const newMenu = await this.menuModel.create({
      name,
      subcategory,
      description: "",
      price,
      image,
      isAvailable: true
    });
    // Populate để lấy tên subcategory
    const populatedMenu = await newMenu.populate('subcategory');

    return {
      _id: populatedMenu._id,
      name: populatedMenu.name,
      subcategory: populatedMenu.subcategory
    }
  }

  async findAll() {
    return await this.menuModel.find({ isAvailable: true }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  async update(updateMenuItemDto: UpdateMenuItemDto) {
    const updatedMenuItem = await this.menuModel
      .findOneAndUpdate(
        { _id: updateMenuItemDto._id }, // Điều kiện tìm bản ghi
        { ...updateMenuItemDto }, // Dữ liệu cập nhật
        { new: true, runValidators: true } // Trả về bản ghi mới và chạy validator
      )
      .exec();

    return updatedMenuItem;
  }

  async remove(_id: string) {
    // Kiểm tra memu có tồn tại không
    const menu = await this.menuModel.findById(_id);
    if (!menu) {
      throw new BadRequestException(`Không tìm thấy menu với id: ${_id}`);
    }
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      await this.menuModel.deleteOne({ _id })
      return {
        message: `Đã xóa menu có id: ${_id} và name: ${menu.name}`,
      }
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb ! ")
    }
  }


}
