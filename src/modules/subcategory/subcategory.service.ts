
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Subcategory } from './schemas/subcategory.schema';
import mongoose, { Model } from 'mongoose';
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

  async findAll() {
    const subcategories = await this.subcategoryModel.find().exec();
    return subcategories.map(subcategory => ({
      _id: subcategory._id,
      name: subcategory.name,
      category: subcategory.category,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }


  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    const updateSubcategori = await this.subcategoryModel.findByIdAndUpdate(
      { _id: id },
      { ...updateSubcategoryDto },
      { new: true, runValidators: true }
    )
      .exec();
    return updateSubcategori;
  }

  async remove(_id: string) {
    // Kiểm tra subcategory có tồn tại không
    const subcategory = await this.subcategoryModel.findById(_id);
    if (!subcategory) {
      throw new BadRequestException(`Không tìm thấy subcategory với id: ${_id}`);
    }
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      await this.subcategoryModel.deleteOne({ _id })
      return {
        message: `Đã xóa subcategory có id: ${_id} và name: ${subcategory.name}`,
      }
    } else {
      throw new BadRequestException("Id khong dung dinh dang mongodb ! ")
    }
  }
}
