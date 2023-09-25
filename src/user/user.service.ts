import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/dto/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.userRepository.find({
      select: { id: true, login: true },
    });
  }

  async createAdmin(user: UserDTO) {
    const users = await this.userRepository.find();

    if (users.length) {
      throw new BadRequestException('Admin already exists.');
    }

    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());

    return {
      user,
      accessToken: await this.jwtService.signAsync(user),
    };
  }

  async login(user: UserDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { login: user.login },
    });

    if (!existingUser) {
      throw new NotFoundException(
        `User with login ${user.login} does not exist`,
      );
    }

    const compared = await bcrypt.compare(user.password, existingUser.password);

    if (!compared) {
      throw new BadRequestException('Password is incorrect');
    }

    return {
      user: existingUser,
      accessToken: await this.jwtService.signAsync(user, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
