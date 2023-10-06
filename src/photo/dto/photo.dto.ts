import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotoDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  path: string;
}
