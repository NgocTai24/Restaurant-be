import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly mailerService: MailerService
  ) { }

  // check category
  isCategoryExits = async (name: string) => {
    const caterory = await this.categoryModel.exists({ name });
    if (caterory) return true;
    return false;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, image } = createCategoryDto;
    const isExits = this.isCategoryExits(name);
    // if (isExits) {
    //   throw new BadGatewayException(`Loại món ${name} đã tồn tại`)
    // }
    const category = await this.categoryModel.create({
      name, image
    })
    return {
      _id: category._id,
      name: category.name,
      image: category.image
    }
  }

  async findAll() {
    const categories = await this.categoryModel.find().exec();
    return categories.map(category => ({
      _id: category._id,
      name: category.name,
      image: category.image,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updateCategori = await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      { ...updateCategoryDto },
      { new: true, runValidators: true }
    )
      .exec();
    return updateCategori;
  }


  async remove(_id: string) {
    // Kiểm tra categori có tồn tại không
    const categori = await this.categoryModel.findById(_id);
    if (!categori) {
      throw new BadRequestException(`Không tìm thấy categori với id: ${_id}`);
    }
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      await this.categoryModel.deleteOne({ _id })
      return {
        message: `Đã xóa categori có id: ${_id} và name: ${categori.name}`,
      }
    } else {
      throw new BadRequestException("Id khong dung dinh dang mongodb ! ")
    }
  }
}
