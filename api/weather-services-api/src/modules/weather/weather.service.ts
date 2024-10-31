import { Injectable } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherProvider: AbstractWeatherProvider) {}

  async getCurrentWeather(zipCode: string): Promise<WeatherDto> {
    return await this.weatherProvider.getWeather(zipCode);
  }

  // Unsupported due to free license restriction but kept for future reference
  async getHistoricalWeather(zipCode: string): Promise<WeatherDto[]> {
    console.log(zipCode);
    const currentDate = new Date();
    const dateArray = this.getDateArray(currentDate, 1);
    const weatherData: WeatherDto[] = [];

    for (const date of dateArray) {
      const data = await this.weatherProvider.getWeatherForDate(zipCode, date);
      console.log(JSON.stringify(data));
      weatherData.push(data);
    }
    return weatherData;
  }

  private getDateArray(currentDate: Date, days: number): Date[] {
    const dates = [];
    let remainingDays = days;
    const targetDate = new Date(currentDate);

    while (remainingDays-- > 0) {
      dates.push(new Date(targetDate));
      targetDate.setDate(targetDate.getDate() - 1);
    }

    return dates;
  }
}
