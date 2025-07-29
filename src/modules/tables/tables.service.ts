import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './schemas/table.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    private readonly mailerService: MailerService
  ) { }

  async create(createTableDto: CreateTableDto) {
    const { name, description, status, capacity, location } = createTableDto;
    const newTable = await this.tableModel.create({
      name, description, status, capacity, location
    })
    return {
      _id: newTable._id,
      name: newTable.name,
      description: newTable.description,
      capacity: newTable.capacity,
      location: newTable.location
    }
  }

  findAll() {
    return `This action returns all tables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    const updatedTable = await this.tableModel
      .findOneAndUpdate(
        { _id: id }, // Điều kiện tìm bản ghi dựa trên id
        { ...updateTableDto }, // Dữ liệu cập nhật
        { new: true, runValidators: true } // Trả về bản ghi mới và chạy validator
      )
      .exec();

    return updatedTable;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
