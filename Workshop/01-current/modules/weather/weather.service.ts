import { Injectable } from '@nestjs/common';
import { WeatherDto } from '../../../api/weather-services-api/src/modules/weather/dto/weather.dto';
import { AbstractWeatherProvider } from '../../../api/weather-services-api/src/modules/weather/dto/weatherProvider.abstract';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherProvider: AbstractWeatherProvider) {}
  async getCurrentWeather(zipCode: string): Promise<WeatherDto> { return this.weatherProvider.getWeather(zipCode); }
}

