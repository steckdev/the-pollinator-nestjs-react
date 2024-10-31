export interface WeatherResponse {
  location: {
    name: string;
    localtime: string;
  };
  current: {
    temperature: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    humidity: number;
    uv_index: number;
    visibility: number;
  };
}
