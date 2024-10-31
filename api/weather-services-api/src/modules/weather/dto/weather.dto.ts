import { ApiProperty } from '@nestjs/swagger';

export class WeatherDto {
  @ApiProperty({ example: '2024-10-30' })
  date: string;

  @ApiProperty({ example: 'Eagle Mountain' })
  locationName: string;

  @ApiProperty({ example: 41 })
  temperature: number;

  @ApiProperty({
    example: [
      'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png',
    ],
  })
  weatherIcons: string[];

  @ApiProperty({ example: ['Sunny'] })
  descriptions: string[];

  @ApiProperty({ example: 'N' })
  windDirection: string;

  @ApiProperty({ example: 10 })
  windSpeed: number;

  @ApiProperty({ example: 25 })
  humidity: number;

  @ApiProperty({ example: 5 })
  uvIndex: number;

  @ApiProperty({ example: 10 })
  visibility: number;
}
