import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Price } from './price.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @OneToMany(() => Price, (price) => price.service, {
    onDelete: 'CASCADE',
  })
  prices: Price[];
}
