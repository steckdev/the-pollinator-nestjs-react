import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { weatherServiceApi } from "../api/weatherServiceApi";
import { useUser } from "../context/UserContext";
import "./WeatherData.css";

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const WeatherData: React.FC = () => {
  const { zip } = useUser(); // Get zip code from UserContext
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);

  const fetchWeatherData = async () => {
    if (!zip) {
      console.warn("Zip code is not set. Cannot fetch weather data.");
      return;
    }

    try {
      const response = await weatherServiceApi.getWeatherByZipCode(zip);
      setWeatherData(response);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (zip) {
      fetchWeatherData();
    }
  }, [zip]);

  return (
    <div className="weather-data">
      {weatherData?.weatherIcons && (
        <img src={weatherData.weatherIcons[0]} alt="weather icon" />
      )}
      <h2 className="title-weather-data">Weather Data</h2>
      {weatherData ? (
        <div className="weather-data-info">
          <h3 className="location">Location: {weatherData.locationName}</h3>
          <h3 className="calendar">Date: {formatDate(weatherData.date)}</h3>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Weather: {weatherData.descriptions.join(", ")}</p>
          <p>
            Wind: {weatherData.windSpeed} km/h {weatherData.windDirection}
          </p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>UV Index: {weatherData.uvIndex}</p>
          <p>Visibility: {weatherData.visibility} km</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
      <Button
        variant="contained"
        onClick={fetchWeatherData}
        className="fetch-button"
        disabled={!zip}
      >
        Fetch Weather Data
      </Button>
    </div>
  );
};

export default WeatherData;
