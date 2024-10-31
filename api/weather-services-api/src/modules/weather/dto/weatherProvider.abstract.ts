import { WeatherDto } from './weather.dto';

export abstract class AbstractWeatherProvider {
  abstract getWeather(zipCode: string): Promise<WeatherDto>;
  abstract getWeatherForDate(zipCode: string, date: Date): Promise<WeatherDto>;
}
