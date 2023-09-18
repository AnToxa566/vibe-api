import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Barbershop } from './barbershop.entity';
import { Graduation } from './graduation.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.prices)
  @JoinColumn({ name: 'barbershop_id' })
  barbershop: Barbershop;

  @ManyToOne(() => Graduation, (graduation) => graduation.prices)
  @JoinColumn({ name: 'graduation_id' })
  graduation: Graduation;
}
