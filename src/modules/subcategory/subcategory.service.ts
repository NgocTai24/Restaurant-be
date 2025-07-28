
import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Subcategory } from './schemas/subcategory.schema';
import { Model } from 'mongoose';
import { Category } from '../categories/schemas/category.schema';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly mailerService: MailerService
  ) { }

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { name, category } = createSubcategoryDto;
    // Kiểm tra xem category có tồn tại không
    const existCategory = await this.categoryModel.findById(category);
    if (!existCategory) {
      throw new Error('Category không tồn tại');
    }

    const newSubcategory = await this.subcategoryModel.create({
      name,
      category,
    });
    // Populate để lấy tên category
    const populatedSubcategory = await newSubcategory.populate('category');

    return {
      _id: populatedSubcategory._id,
      name: populatedSubcategory.name,
      category: populatedSubcategory.category
    }
  }

  findAll() {
    return this.subcategoryModel.find().populate('category');
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
