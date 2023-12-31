import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() user: UserDTO) {
    return await this.userService.createAdmin(user);
  }

  @Put('update-password')
  @UsePipes(new ValidationPipe())
  async updatePassword(@Body() user: UpdateUserDTO) {
    return await this.userService.updateAdminPassword(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: UserDTO) {
    return await this.userService.login(user);
  }
}
