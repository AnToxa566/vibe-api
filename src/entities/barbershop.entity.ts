import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Barber } from './barber.entity';
import { Price } from './price.entity';

@Entity()
export class Barbershop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id', unique: true })
  companyId: number;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column()
  address: string;

  @Column('character varying', { array: true, name: 'phone_numbers' })
  phoneNumbers: string[];

  @Column()
  schedule: string;

  @OneToMany(() => Barber, (barber) => barber.barbershop, {
    onDelete: 'CASCADE',
  })
  barbers: Barber[];

  @OneToMany(() => Price, (price) => price.barbershop, {
    onDelete: 'CASCADE',
  })
  prices: Price[];
}
