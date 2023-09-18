import { PartialType } from '@nestjs/mapped-types';

import { BarbershopDTO } from './barbershop.dto';

export class UpdateBarbershopDTO extends PartialType(BarbershopDTO) {}
