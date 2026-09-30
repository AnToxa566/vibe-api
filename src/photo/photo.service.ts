import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo } from '../entities/photo.entity';
import { PhotoDTO } from './dto/photo.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly storageService: StorageService,
  ) {}

  async getPhotos(): Promise<PhotoDTO[]> {
    return await this.photoRepository.find({ order: { id: 'DESC' } });
  }

  async createPhoto(image: Express.Multer.File): Promise<PhotoDTO> {
    if (!image) {
      throw new BadRequestException('Необходимо загрузить изображение.');
    }

    const key = await this.storageService.upload(image);

    try {
      const photo = await this.photoRepository.save({ path: key });

      return { id: photo.id, path: this.storageService.getUrl(key) };
    } catch (error) {
      await this.storageService.delete(key);
      throw error;
    }
  }

  async deletePhoto(id: number): Promise<boolean> {
    const photo = await this.ckeckPhotoExist(id);
    await this.photoRepository.delete(id);
    await this.storageService.delete(photo.path);

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
