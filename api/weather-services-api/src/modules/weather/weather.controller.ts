import { WeatherDto } from './dto/weather.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({ summary: 'Get weather by zip code' })
  @ApiResponse({
    status: 200,
    description: 'Returns the weather for the given zip code.',
    type: () => WeatherDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Weather data not found',
    type: () => Error,
  })
  @Get(':zipCode')
  async getWeather(
    @Param('zipCode') zipCode: string,
  ): Promise<WeatherDto | HttpStatus> {
    const response = await this.weatherService.getCurrentWeather(zipCode);
    if (response) return response;
    else
      throw new HttpException('Weather data not found', HttpStatus.NOT_FOUND);
  }
}
