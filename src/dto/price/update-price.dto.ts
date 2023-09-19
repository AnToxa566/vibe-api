import { PartialType } from '@nestjs/mapped-types';

import { PriceDTO } from './price.dto.';

export class UpdatePriceDTO extends PartialType(PriceDTO) {}
