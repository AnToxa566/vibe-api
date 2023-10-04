import { PartialType } from '@nestjs/mapped-types';

import { GraduationDTO } from './graduation.dto';

export class UpdateGraduationDTO extends PartialType(GraduationDTO) {}
