import { HttpService } from '@nestjs/axios';
import { WeatherLocalDataProvider } from './weatherLocalData.provider';
import { WeatherstackProvider } from './weatherstack.provider';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';

export function createWeatherProvider(): AbstractWeatherProvider {
  if (process.env.LOCAL_DATA === 'true') {
    return new WeatherLocalDataProvider();
  }

  return new WeatherstackProvider(new HttpService());
}
