import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PhotoDTO } from './dto/photo.dto';
import { PhotoService } from './photo.service';
import { AuthGuard } from '../guards/auth.guard';
import { fileOptions } from '../barber/barber.controller';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  async getBarbers() {
    return await this.photoService.getPhotos();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', fileOptions))
  async createBarber(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PhotoDTO> {
    return await this.photoService.createPhoto(image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBarber(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.photoService.deletePhoto(id);
  }
}
