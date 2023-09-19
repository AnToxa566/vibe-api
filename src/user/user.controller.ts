import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() user: UserDTO) {
    return await this.userService.createAdmin(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: UserDTO) {
    return await this.userService.login(user);
  }
}
