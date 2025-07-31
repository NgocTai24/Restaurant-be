import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import mongoose, { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { MenuItem } from '../menu-items/schemas/menu-item.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuModel: Model<MenuItem>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { user, items, totalAmount, notes } = createOrderDto;
    const newOrder = await this.orderModel.create({
      user,
      items,
      totalAmount,
      notes
    });
    // Populate để lấy tên user
    const populatedOrder = await newOrder.populate('user', 'name email _id');

    return {
      _id: populatedOrder._id,
      user: populatedOrder.user,
      totalAmount: populatedOrder.totalAmount,
      notes: populatedOrder.notes
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
    try {
      const order = await this.orderModel
        .findById(id)
        .select('items totalAmount') // Chỉ chọn các trường của Order, không chọn user._id, user.name, user.email
        .populate('user', 'name email _id') // Populate user với các trường cụ thể
        .lean()
        .exec();

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        statusCode: 200,
        message: '',
        data: order,
      };
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException(`Invalid Order ID: ${id}`);
      }
      throw new Error('Internal server error');
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updateOrder = await this.orderModel.findByIdAndUpdate(
      { _id: id },
      { ...updateOrderDto },
      { new: true, runValidators: true }
    )
      .exec();
    return updateOrder;
  }



  async remove(_id: string) {
    // Kiểm tra order có tồn tại không
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(`Không tìm thấy order với id: ${_id}`);
    }
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      await this.orderModel.deleteOne({ _id })
      return {
        message: `Đã xóa order có id: ${_id} `,
      }
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb ! ")
    }
  }
}
