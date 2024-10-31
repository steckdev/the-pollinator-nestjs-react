import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { WeatherDto } from './dto/weather.dto';
import { AbstractWeatherProvider } from './dto/weatherProvider.abstract';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  const testZipCode = '12345';
  const mockWeatherProvider = mock<AbstractWeatherProvider>();
  const mockWeatherDto = mock<WeatherDto>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: AbstractWeatherProvider,
          useValue: mockWeatherProvider,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentWeather', () => {
    describe('given a zip code with weather data', () => {
      it('should return weather data for the given zip code', async () => {
        mockWeatherProvider.getWeather.mockResolvedValue(mockWeatherDto);

        const result = await service.getCurrentWeather(testZipCode);

        expect(result).toEqual(mockWeatherDto);
        expect(mockWeatherProvider.getWeather).toHaveBeenCalledWith(
          testZipCode,
        );
      });
    });

    it('should throw an error if weatherProvider.getWeather fails', async () => {
      mockWeatherProvider.getWeather.mockRejectedValue(
        new Error('Failed to fetch weather data'),
      );

      await expect(service.getCurrentWeather(testZipCode)).rejects.toThrow(
        'Failed to fetch weather data',
      );
    });
  });

  describe('getHistoricalWeather', () => {
    describe('given a zip code with historical weather data', () => {
      it('should return historical weather data for the given zip code', async () => {
        mockWeatherProvider.getWeatherForDate.mockResolvedValue(mockWeatherDto);

        const result = await service.getHistoricalWeather(testZipCode);

        expect(result).toEqual([mockWeatherDto]);
        expect(mockWeatherProvider.getWeatherForDate).toHaveBeenCalledWith(
          testZipCode,
          expect.any(Date),
        );
      });
    });

    it('should throw an error if weatherProvider.getWeatherForDate fails', async () => {
      mockWeatherProvider.getWeatherForDate.mockRejectedValue(
        new Error('Failed to fetch historical weather data'),
      );

      await expect(service.getHistoricalWeather(testZipCode)).rejects.toThrow(
        'Failed to fetch historical weather data',
      );
    });
  });
});
