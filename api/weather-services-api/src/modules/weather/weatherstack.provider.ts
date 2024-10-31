import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';
import { WeatherDto } from './dto/weather.dto';
import { WeatherResponse } from './dto/weather.interface';
// we need to import json from example_weather_response.json;

const FAHRENHEIT_UNIT = 'f';

@Injectable()
export class WeatherstackProvider implements AbstractWeatherProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = `${process.env.WEATHER_STACK_API_URL}`;
    this.apiKey = process.env.WEATHER_STACK_API_KEY;
  }

  async getWeather(zipCode: string): Promise<WeatherDto> {
    console.log(
      'WeatherStackProvider: Retrieving weather data from WeatherStack API',
    );
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/current`, {
        params: {
          access_key: this.apiKey,
          query: zipCode,
          units: FAHRENHEIT_UNIT,
        },
      }),
    );
    return this.convertResponseToWeatherDto(data);
  }

  async getWeatherForDate(zipCode: string, date: Date): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/historical`, {
        params: {
          access_key: this.apiKey,
          query: zipCode,
          historical_date: date.toISOString().split('T')[0],
        },
      }),
    );
    return this.convertResponseToWeatherDto(data);
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
