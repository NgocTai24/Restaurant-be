import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
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
    if (isExits) {
      throw new BadGatewayException(`Loại món ${name} đã tồn tại`)
    }
    const category = await this.categoryModel.create({
      name, image
    })
    return {
      _id: category._id,
      name: category.name,
      image: category.image
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
