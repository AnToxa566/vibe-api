import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserDTO } from './dto/user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

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

    user.password = await this.getHashPassword(user.password);

    return {
      user,
      accessToken: await this.getAccessToken(user),
    };
  }

  async updateAdminPassword(user: UpdateUserDTO) {
    const existingUser = await this.checkUser(user.login, user.oldPassword);
    existingUser.password = await this.getHashPassword(user.newPassword);

    return {
      user: await this.userRepository.save(existingUser),
      accessToken: await this.getAccessToken(existingUser),
    };
  }

  async login(user: UserDTO) {
    const existingUser = await this.checkUser(user.login, user.password);

    return {
      user: existingUser,
      accessToken: await this.getAccessToken(existingUser),
    };
  }

  async checkUser(login: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      throw new NotFoundException(`User with login ${login} does not exist`);
    }

    const compared = await bcrypt.compare(password, user.password);

    if (!compared) {
      throw new BadRequestException('Password is incorrect');
    }

    return user;
  }

  async getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }

  async getAccessToken(user: UserDTO): Promise<string> {
    return await this.jwtService.signAsync(JSON.stringify(user), {
      secret: process.env.JWT_SECRET,
    });
  }
}
