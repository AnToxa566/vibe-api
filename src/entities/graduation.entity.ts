import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Barber } from './barber.entity';
import { Price } from './price.entity';

@Entity()
export class Graduation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  priority: number;

  @OneToMany(() => Barber, (barber) => barber.graduation, {
    onDelete: 'CASCADE',
  })
  barbers: Barber[];

  @OneToMany(() => Price, (price) => price.graduation, {
    onDelete: 'CASCADE',
  })
  prices: Price[];
}
