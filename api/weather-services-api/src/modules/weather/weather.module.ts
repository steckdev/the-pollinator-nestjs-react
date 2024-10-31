import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';
import { createWeatherProvider } from './weatherProvider.factory';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    WeatherService,
    {
      provide: AbstractWeatherProvider,
      useFactory: createWeatherProvider,
    },
  ],
})
export class WeatherModule {}
