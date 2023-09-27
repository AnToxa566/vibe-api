import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { BarberService } from './barber.service';
import { BarberDTO } from 'src/dto/barber/barber.dto';
import { UpdateBarberDTO } from 'src/dto/barber/update-barber.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Barber } from 'src/entities/barber.entity';

const fileOptions: MulterOptions = {
  storage: diskStorage({
    destination: './barbers',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async getBarbers() {
    return await this.barberService.getBarbers();
  }

  @Get(':id')
  async getBarber(@Param('id', ParseIntPipe) id: number) {
    return await this.barberService.getBarber(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', fileOptions))
  async createBarber(
    @Body() payload: BarberDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Barber> {
    return await this.barberService.createBarber(payload, image);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', fileOptions))
  async updateBarber(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarberDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.barberService.updateBarber(id, payload, image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBarber(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.barberService.deleteBarber(id);
  }
}
