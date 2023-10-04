import { PartialType } from '@nestjs/mapped-types';

import { ServiceDTO } from './service.dto';

export class UpdateServiceDTO extends PartialType(ServiceDTO) {}
