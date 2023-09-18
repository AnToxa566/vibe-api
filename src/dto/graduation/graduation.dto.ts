import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GraduationDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}
