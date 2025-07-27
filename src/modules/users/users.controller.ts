import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()// ko can access_token
  async findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @Public()// ko can access_token
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update( @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update( updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
