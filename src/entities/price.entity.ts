import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Barbershop } from './barbershop.entity';
import { Graduation } from './graduation.entity';
import { Service } from './service.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => Service, (service) => service.prices)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.prices)
  @JoinColumn({ name: 'barbershop_id' })
  barbershop: Barbershop;

  @ManyToOne(() => Graduation, (graduation) => graduation.prices)
  @JoinColumn({ name: 'graduation_id' })
  graduation: Graduation;
}
