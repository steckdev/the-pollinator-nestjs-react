import { Module } from '@nestjs/common';
import { AppController } from '../../api/weather-services-api/src/app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from '../../api/weather-services-api/src/app.service';
import { UsersModule } from '../../api/weather-services-api/src/modules/users/users.module';
import { DatabaseModule } from '../../api/weather-services-api/src/core/database/database.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { WeatherModule } from '../../api/weather-services-api/src/modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    HttpModule,
    DatabaseModule,
    UsersModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [DatabaseModule],
})
export class AppModule {}

