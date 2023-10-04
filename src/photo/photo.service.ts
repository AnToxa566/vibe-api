import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo } from '../entities/photo.entity';
import { PhotoDTO } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async getPhotos(): Promise<PhotoDTO[]> {
    return await this.photoRepository.find({ order: { id: 'DESC' } });
  }

  async createPhoto(image: Express.Multer.File): Promise<PhotoDTO> {
    return await this.photoRepository.save({
      path: image.filename,
    });
  }

  async deletePhoto(id: number): Promise<boolean> {
    await this.ckeckPhotoExist(id);
    await this.photoRepository.delete(id);

    return true;
  }

  async ckeckPhotoExist(id: number): Promise<PhotoDTO> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(`Фото с ID ${id} не найден.`);
    }

    return photo;
  }
}
