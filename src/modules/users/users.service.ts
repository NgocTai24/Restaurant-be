
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly mailerService: MailerService
  ) { }
  // check email
  isEmailExits = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    //Chech email exits
    const isExist = await this.isEmailExits(email);
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại!`)
    }
    //hash Password
    const hashPassword = await hashPasswordHelper(password);
    const role = await this.roleModel.findOne({ name: 'customer' });
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image, role: role
    })
    return {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);
    return { results, totalPages };
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string): Promise<any> {
    return this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
        select: '_id name'
      })
      .lean(); // giúp trả về plain object, dễ tùy chỉnh
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    // Kiểm tra user có tồn tại không
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new BadRequestException(`Không tìm thấy user với id: ${_id}`);
    }
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      await this.userModel.deleteOne({ _id })
      return {
        message: `Đã xóa user có id: ${_id} và email: ${user.email}`,
      }
    } else {
      throw new BadRequestException("Id khong dung dinh dang mongodb ! ")
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    //Chech email exits
    const isExist = await this.isEmailExits(email);
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại!`)
    }
    //hash Password
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const role = await this.roleModel.findOne({ name: 'customer' });
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive: false,
      codeId: codeId,
      role: role,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send Email for user
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your accont at Ngọc Tài', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    // trả ra phản hồi
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }



  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ/ đã hết hạn")
    }
    // check expire code 
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ/ đã hết hạn")
    }
  }

  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    //send email
    const codeId = uuidv4();
    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your accont at Ngọc Tài', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    // trả ra phản hồi
    return {
      _id: user._id
    }

    return { _id: user._id }
  }

  async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    const codeId = uuidv4();
    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password accont at Ngọc Tài', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    // trả ra phản hồi
    return {
      _id: user._id,
      email: user.email
    }

  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException("Mật khẩu và xác nhận mật khẩu không hợp lệ")
    }

    //check email
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    // check expire code 
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //valid => update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ/ đã hết hạn")
    }

  }
}
