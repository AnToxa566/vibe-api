import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Barbershop } from './barbershop.entity';
import { Graduation } from './graduation.entity';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'img_path' })
  imgPath: string;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.barbers)
  @JoinColumn({ name: 'barbershop_id' })
  barbershop: Barbershop;

  @ManyToOne(() => Graduation, (graduation) => graduation.barbers)
  @JoinColumn({ name: 'graduation_id' })
  graduation: Graduation;
}
