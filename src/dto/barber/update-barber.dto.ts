import { PartialType } from '@nestjs/mapped-types';

import { BarberDTO } from './barber.dto';

export class UpdateBarberDTO extends PartialType(BarberDTO) {}
