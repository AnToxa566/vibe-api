import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarbershopsModule } from './barbershops/barbershops.module';

import { Barbershop } from './entities/barbershop.entity';
import { Barber } from './entities/barber.entity';
import { Graduation } from './entities/graduation.entity';
import { Service } from './entities/service.entity';
import { Price } from './entities/price.entity';

@Module({
  imports: [
    BarbershopsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [Barbershop, Barber, Graduation, Service, Price],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
