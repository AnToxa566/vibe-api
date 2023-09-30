import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ServiceDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle: string;
}
