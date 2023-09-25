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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { BarberService } from './barber.service';
import { BarberDTO } from 'src/dto/barber/barber.dto';
import { UpdateBarberDTO } from 'src/dto/barber/update-barber.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Barber } from 'src/entities/barber.entity';

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async getBarbers() {
    return await this.barberService.getBarbers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
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
    }),
  )
  async createBarber(
    @Body() payload: BarberDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Barber> {
    console.log(image);
    return await this.barberService.createBarber(payload, image);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateBarber(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarberDTO,
  ) {
    return await this.barberService.updateBarber(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBarber(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.barberService.deleteBarber(id);
  }
}
