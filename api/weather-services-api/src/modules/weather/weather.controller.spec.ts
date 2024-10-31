import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { WeatherDto } from './dto/weather.dto';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { mock } from 'jest-mock-extended';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  const testZipCode = '12345';

  const mockWeatherService = mock<WeatherService>();
  const mockWeatherDto = mock<WeatherDto>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
  });

  describe('getWeather', () => {
    describe('given a valid zip code', () => {
      it('should return weather data for a valid zip code', async () => {
        mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeatherDto);
        const result = await weatherController.getWeather(testZipCode);

        expect(result).toBe(mockWeatherDto);
        expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
          testZipCode,
        );
      });
    });

    describe('given an valid zip code with no weather data', () => {
      beforeEach(() => {
        mockWeatherService.getCurrentWeather.mockResolvedValue(null);
      });
      it('should throw HttpException when weather data is not found', async () => {
        await expect(weatherController.getWeather(testZipCode)).rejects.toThrow(
          new HttpException('Weather data not found', HttpStatus.NOT_FOUND),
        );

        expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
          testZipCode,
        );
      });
    });
  });
});
