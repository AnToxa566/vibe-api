import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Graduation } from 'src/entities/graduation.entity';
import { GraduationDTO } from 'src/dto/graduation/graduation.dto';

@Injectable()
export class GraduationService {
  constructor(
    @InjectRepository(Graduation)
    private readonly graduationRepository: Repository<Graduation>,
  ) {}

  async getGraduations(): Promise<GraduationDTO[]> {
    return await this.graduationRepository.find({
      relations: { prices: true },
    });
  }

  async getGraduation(id: number): Promise<GraduationDTO> {
    return await this.ckeckGraduationExist(id);
  }

  async createGraduation(payload: GraduationDTO): Promise<GraduationDTO> {
    await this.ckeckGraduationData(payload);
    return await this.graduationRepository.save(payload);
  }

  async updateGraduation(
    id: number,
    payload: GraduationDTO,
  ): Promise<GraduationDTO> {
    await this.ckeckGraduationExist(id);
    await this.ckeckGraduationData(payload);
    await this.graduationRepository.update(id, payload);

    return await this.getGraduation(id);
  }

  async deleteGraduation(id: number): Promise<boolean> {
    await this.ckeckGraduationExist(id);
    await this.graduationRepository.delete(id);

    return true;
  }

  async ckeckGraduationExist(id: number) {
    const graduation = await this.graduationRepository.findOne({
      where: { id },
      relations: { prices: true },
    });

    if (!graduation) {
      throw new NotFoundException(`Градация с ID ${id} не найден.`);
    }

    return graduation;
  }

  async ckeckGraduationData(payload: GraduationDTO) {
    const graduation = await this.graduationRepository.findOne({
      where: { title: payload.title },
    });

    if (graduation) {
      throw new BadRequestException(
        `Градация с названием ${payload.title} уже существует`,
      );
    }
  }
}
