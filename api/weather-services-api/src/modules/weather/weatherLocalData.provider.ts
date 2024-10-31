import { Injectable, NotImplementedException } from '@nestjs/common';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';
import { WeatherDto } from './dto/weather.dto';
import { WeatherResponse } from './dto/weather.interface';
import * as data from './dto/example_weather_response.json';

@Injectable()
export class WeatherLocalDataProvider implements AbstractWeatherProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getWeather(_zipCode: string): Promise<WeatherDto> {
    console.log('WeatherLocalDataProvider: Responding with local data');
    return this.convertResponseToWeatherDto(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getWeatherForDate(_zipCode: string, _date: Date): Promise<any> {
    throw new NotImplementedException();
  }

  private convertResponseToWeatherDto(data: WeatherResponse): WeatherDto {
    return {
      date: data.location.localtime,
      locationName: data.location.name,
      temperature: data.current.temperature,
      weatherIcons: data.current.weather_icons,
      descriptions: data.current.weather_descriptions,
      windSpeed: data.current.wind_speed,
      windDirection: data.current.wind_dir,
      humidity: data.current.humidity,
      uvIndex: data.current.uv_index,
      visibility: data.current.visibility,
    };
  }
}
