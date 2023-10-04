import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ServiceDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @IsString()
  @IsOptional()
  subtitle: string;
}
