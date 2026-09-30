import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { imageUrlTransformer } from '../storage/image-url';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ transformer: imageUrlTransformer })
  path: string;
}
