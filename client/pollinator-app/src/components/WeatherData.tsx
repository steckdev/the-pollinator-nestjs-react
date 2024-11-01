import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import watercolor from "../assets/watercolor-image.png";
import { weatherServiceApi } from "../api/weatherServiceApi";

interface WeatherDataProps {
  date: string;
  locationName: string;
  temperature: number;
  weatherIcons: string[];
  descriptions: string[];
  windDirection: string;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  visibility: number;
}

const WeatherData: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);

  const fetchWeatherData = async () => {
    try {
      const response = await weatherServiceApi.getWeatherByZipCode("84005");
      setWeatherData(response);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>The Pollinator</h1>
      </header>
      <div className="App-body">
        <div>
          <h2 className="title-weather-data">Weather Data</h2>
          <div className="weather-data">
            {weatherData ? (
              <>
                <h3 className="location">
                  Location: {weatherData.locationName}
                </h3>
                <h3 className="calendar">Date: {weatherData.date}</h3>
                <p>Temperature: {weatherData.temperature}°C</p>
                <p>Weather: {weatherData.descriptions.join(", ")}</p>
                <img src={weatherData.weatherIcons[0]} alt="weather icon" />
                <p>
                  Wind: {weatherData.windSpeed} km/h {weatherData.windDirection}
                </p>
                <p>Humidity: {weatherData.humidity}%</p>
                <p>UV Index: {weatherData.uvIndex}</p>
                <p>Visibility: {weatherData.visibility} km</p>
              </>
            ) : (
              <p>Loading weather data...</p>
            )}
          </div>
          <Button variant="contained" onClick={fetchWeatherData}>
            Fetch Weather Data
          </Button>
          <img src={watercolor} className="App-logo" alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
