import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BarbershopsModule } from './barbershops/barbershops.module';
import { GraduationModule } from './graduation/graduation.module';
import { BarberModule } from './barber/barber.module';
import { ServiceModule } from './service/service.module';
import { PriceModule } from './price/price.module';
import { UserModule } from './user/user.module';

import { Barbershop } from './entities/barbershop.entity';
import { Barber } from './entities/barber.entity';
import { Graduation } from './entities/graduation.entity';
import { Service } from './entities/service.entity';
import { Price } from './entities/price.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
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
        entities: [User, Barbershop, Barber, Graduation, Service, Price],
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    BarbershopsModule,
    GraduationModule,
    BarberModule,
    ServiceModule,
    PriceModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
