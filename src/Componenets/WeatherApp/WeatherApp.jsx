import React, { useState } from "react";
import "./WeatherApp.css";

import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";

const WeatherApp = () => {
	const api_key = "974a5fb10ece1c27809438a04b1b2769";

	const [input, setInput] = useState("");
	const [weather, setWeather] = useState({
		humidity: "",
		wind: "",
		temp: "",
		location: "",
		icon: clear_icon,
	});
	const [background, setBackground] = useState("clear-bg");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const setWeatherIconAndBackground = (iconCode) => {
		if (iconCode === "01d" || iconCode === "01n") {
			setBackground("clear-bg");
			return clear_icon;
		} else if (iconCode === "02d" || iconCode === "02n") {
			setBackground("cloudy-bg");
			return cloud_icon;
		} else if (iconCode.startsWith("03") || iconCode.startsWith("04")) {
			setBackground("overcast-bg");
			return drizzle_icon;
		} else if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
			setBackground("rainy-bg");
			return rain_icon;
		} else if (iconCode.startsWith("13")) {
			setBackground("snowy-bg");
			return snow_icon;
		} else {
			setBackground("default-bg");
			return clear_icon;
		}
	};

	const search = async () => {
		if (!input) {
			setError("Please enter a city name.");
			return;
		}

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=${api_key}`;

		try {
			setIsLoading(true);
			setError("");
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("City not found.");
			}
			const data = await response.json();

			setWeather({
				humidity: `${data.main.humidity}%`,
				wind: `${Math.floor(data.wind.speed)} mph`,
				temp: `${Math.floor(data.main.temp)}`,
				location: data.name,
				icon: setWeatherIconAndBackground(data.weather[0].icon),
			});
		} catch (error) {
			setError(error.message);
			setWeather({
				humidity: "",
				wind: "",
				temp: "",
				location: "",
				icon: clear_icon,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`container ${background}`}>
			<div className="top-bar">
				<input
					type="text"
					className="cityInput"
					placeholder="Enter city name..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<div className="search-icon" onClick={search}>
					<img src={search_icon} alt="Search Icon" />
				</div>
			</div>
			{isLoading ? (
				<div className="loading">Fetching weather data...</div>
			) : error ? (
				<div className="error">{error}</div>
			) : (
				<>
					<div className="weather-img">
						<center>
							<img src={weather.icon} alt="Weather Icon" />
						</center>
					</div>
					<div className="weather-temp">{weather.temp}°F</div>
					<div className="weather-location">{weather.location}</div>
					<div className="data-container">
						<div className="element">
							<img src={humidity_icon} alt="Humidity Icon" className="icon" />
							<div className="data">
								<div className="humidity-percentage">{weather.humidity}</div>
								<div className="label">Humidity</div>
							</div>
						</div>
						<div className="element">
							<img src={wind_icon} alt="Wind Icon" className="icon" />
							<div className="data">
								<div className="wind-rate">{weather.wind}</div>
								<div className="label">Wind Speed</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default WeatherApp;
