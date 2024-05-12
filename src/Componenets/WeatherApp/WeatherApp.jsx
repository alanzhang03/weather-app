import React, { useState } from 'react'
import './WeatherApp.css'

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

const WeatherApp = () => {
    const api_key = "974a5fb10ece1c27809438a04b1b2769";

    const [weather, setWeather] = useState({
        humidity: '',
        wind: '',
        temp: '',
        location: '',
        icon: clear_icon 
    });


    const setWeatherIcon = (iconCode) => {
        if (iconCode === "01d" || iconCode === "01n") {
            return clear_icon;
        } else if (iconCode === "02d" || iconCode === "02n") {
            return cloud_icon;
        } else if (iconCode === "03d" || iconCode === "03n") {
            return drizzle_icon;
        } else if (iconCode === "04d" || iconCode === "04n") {
            return drizzle_icon;
        } else if (iconCode === "09d" || iconCode === "09n") {
            return rain_icon;
        } else if (iconCode === "10d" || iconCode === "10n") {
            return rain_icon;
        } else if (iconCode === "13d" || iconCode === "13n") {
            return snow_icon;
        } else {
            return clear_icon;
        }
    };

    const search = async () => {
        const cityInputElement = document.querySelector(".cityInput");
        if (cityInputElement && cityInputElement.value === "") {
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputElement.value}&units=imperial&appid=${api_key}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            setWeather({
                humidity: `${data.main.humidity}%`,
                wind: `${Math.floor(data.wind.speed)} mph`,
                temp: `${Math.floor(data.main.temp)}`,
                location: data.name,
                icon: setWeatherIcon(data.weather[0].icon) 
            });
        } catch (error) {
            console.error("Error fetching weather data: ", error);
        }
    };

    return (
        <>
        <div className='container'>
            <div className='top-bar'>
                <input type="text" className="cityInput" placeholder='Search'></input>
                <div className="search-icon" onClick={search}>
                    <img src={search_icon} alt="Search Icon"></img>
                </div>
            </div>
            <div className="weather-img">
                <center><img src={weather.icon} alt="Weather Icon"></img></center>
            </div>
            <div className="weather-temp">{weather.temp}°F</div>
            <div className="weather-location">{weather.location}</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="Humidity Icon" className="icon"></img>
                    <div className="data">
                        <div className="humidity-percentage">{weather.humidity}</div>
                        <div className="test">Humidity</div>
                    </div>
                </div>

                <div className="element">
                    <img src={wind_icon} alt="Wind Icon" className="icon"></img>
                    <div className="data">
                        <div className="wind-rate">{weather.wind}</div>
                        <div className="test">Wind speed</div>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default WeatherApp;