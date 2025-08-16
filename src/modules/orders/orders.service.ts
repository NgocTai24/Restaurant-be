import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import mongoose, { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { MenuItem } from '../menu-items/schemas/menu-item.schema';
import { User } from '../users/schemas/user.schema';


// Định nghĩa kiểu cho req.user
declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      email?: string;
      role?: string;
    };
  }
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuModel: Model<MenuItem>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { }

  async create(@Request() req, createOrderDto: CreateOrderDto) {
    const { items, notes } = createOrderDto;

    // Lấy user từ token
    const userId = req.user?._id;
    if (!userId) {
      throw new BadRequestException('User không được xác thực!');
    }

    // Tính totalAmount dựa trên giá của MenuItem (giả sử mỗi item có quantity = 1)
    let totalAmount = 0;
    for (const itemId of items) {
      const menuItem = await this.menuModel.findById(itemId).exec();
      if (!menuItem) throw new NotFoundException(`Menu item ${itemId} not found`);
      totalAmount += menuItem.price;
    }

    // Sử dụng totalAmount từ DTO nếu có, nếu không dùng giá trị tính toán
    const finalTotalAmount = createOrderDto.totalAmount || totalAmount;

    const newOrder = await this.orderModel.create({
      user: userId,
      items,
      totalAmount: finalTotalAmount,
      notes,
    });

    const populatedOrder = await (await newOrder
      .populate('user', 'name email _id'))
      .populate('items', 'name price');

    return {
      _id: populatedOrder._id,
      user: populatedOrder.user,
      items: populatedOrder.items,
      totalAmount: populatedOrder.totalAmount,
      notes: populatedOrder.notes,
    };
  }

  async findAll() {
    try {
      // Lấy tất cả các order và populate các trường liên quan
      const orders = await this.orderModel
        .find({ status: { $ne: 'CANCELLED' } }) // Lọc các order chưa bị hủy (tùy chỉnh theo enum OrderStatus)
        .populate('user', 'name email _id')
        .populate('items', 'name price')
        .lean()
        .exec();

      if (!orders || orders.length === 0) {
        return {
          statusCode: 200,
          message: 'Không có order nào được tìm thấy',
          data: [],
        };
      }

      return {
        statusCode: 200,
        message: 'Lấy danh sách order thành công',
        data: orders,
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách order: ' + error.message);
    }
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
