import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BarbershopsModule } from './barbershops/barbershops.module';
import { GraduationModule } from './graduation/graduation.module';
import { BarberModule } from './barber/barber.module';
import { ServiceModule } from './service/service.module';
import { PriceModule } from './price/price.module';
import { UserModule } from './user/user.module';
import { PhotoModule } from './photo/photo.module';
import { StorageModule } from './storage/storage.module';

import { Barbershop } from './entities/barbershop.entity';
import { Barber } from './entities/barber.entity';
import { Graduation } from './entities/graduation.entity';
import { Service } from './entities/service.entity';
import { Price } from './entities/price.entity';
import { User } from './entities/user.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const url = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          ...(url
            ? { url }
            : {
                host: configService.get<string>('DB_HOST'),
                port: Number(configService.get('DB_PORT')),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
              }),
          ssl:
            configService.get('DB_SSL') === 'true'
              ? { rejectUnauthorized: false }
              : false,
          poolSize: Number(configService.get('DB_POOL_SIZE') ?? 5),
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          entities: [
            User,
            Barbershop,
            Barber,
            Graduation,
            Service,
            Price,
            Photo,
          ],
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    StorageModule,
    BarbershopsModule,
    GraduationModule,
    BarberModule,
    ServiceModule,
    PriceModule,
    UserModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
