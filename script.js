// Object Maping For Weather Icon
const iconMap = {
  // Clear Sky
  '01d': 'images/sunny.png',
  '01n': 'images/crescent-moon.png',
  // Few Clouds
  '02d': 'images/sun with cloud.png',
  '02n': 'images/crescent-moon with cloud.png',
  // Scattered & Broken Clouds
  '03d': 'images/cloud.png',
  '03n': 'images/cloud.png',
  '04d': 'images/cloud.png',
  '04n': 'images/cloud.png',
  // Shower Rain & Rain
  '09d': 'images/heavy-rain.png',
  '09n': 'images/heavy-rain.png',
  '10d': 'images/heavy-rain.png',
  '10n': 'images/heavy-rain.png',
  // Thunderstorm
  '11d': 'images/thunderstorm.png',
  '11n': 'images/thunderstorm.png',
  // Snow
  '13d': 'images/snow.png',
  '13n': 'images/snow.png',
  // Mist/Fog
  '50d': 'images/cloud.png',
  '50n': 'images/cloud.png',
};

// Loading Function
const loadingSpinner = (status) => {
  if (status) {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
  } else {
    loading.classList.add('hidden');
  }
};

// Weather Data Load From API

const errorClasses = document.querySelectorAll('.error-class');
const weatherDataLoad = async (cityName) => {
  loadingSpinner(true);
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ca49a746b15729dea42283fc51e81e0c`;
    const res = await fetch(url);
    if (!res.ok) {
      errorManager(cityError);
      loadingSpinner(false);
      return;
    }
    removeError();
    localStorage.setItem('lastCity', cityName);
    const data = await res.json();
    displayWeatherData(data);
  } catch (error) {
    errorManager(error404);
    loadingSpinner(false);
  }
};

// Error Manager
const cityError = document.getElementById('city-error');
const error404 = document.getElementById('error-404');
const errorManager = (errorElementToShow) => {
  errorClasses.forEach((errorClass) => {
    errorClass.classList.add('hidden');
    errorElementToShow.classList.remove('hidden');
  });
};

const removeError = () => {
  cityError.classList.add('hidden');
  error404.classList.add('hidden');
  errorClasses.forEach((errorClass) => {
    errorClass.classList.remove('hidden');
  });
};

// Input Section
const inputField = document.getElementById('input-field');
const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = inputField.value.toLowerCase();
  weatherDataLoad(inputValue);
});

// Display Weather Data
const displayWeatherData = (data) => {
  // City Name After Search
  const cityName = document.getElementById('city-name');
  cityName.textContent = data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  //   Celsius
  const celsiusDisplay = document.getElementById('celsius-display');
  const celsiusData = Math.round(data.main.temp - 273.15);
  celsiusDisplay.textContent = celsiusData;
  const feelsLike = document.getElementById('feels-like');
  const feelsLikeCelsiusData = Math.round(data.main['feels_like'] - 273.15);
  feelsLike.textContent = feelsLikeCelsiusData;
  // Weather Description
  const weatherDescrip = document.getElementById('weather-descrip');
  const weatherDescripData = data.weather[0].main;
  weatherDescrip.textContent = weatherDescripData;
  // Humidity
  const displayHumidity = document.getElementById('display-humidity');
  const humidityData = data.main.humidity;
  displayHumidity.textContent = humidityData;
  // Wind Speed
  const displayWindSpeed = document.getElementById('display-wind-speed');
  const windSpeedData = data.wind.speed;
  displayWindSpeed.textContent = windSpeedData;
  // Weather Icon
  const displayWeatherIcon = document.getElementById('display-weather-icon');
  displayWeatherIcon.innerHTML = '';
  const iconCode = data.weather[0].icon;
  const customIconPath = iconMap[iconCode];
  displayWeatherIcon.innerHTML += `
      <img class="w-16 opacity-80 mx-auto mt-6 mb-1.5" src="${customIconPath}" alt="" />`;
  loadingSpinner(false);
};

// Current Location
const currentlocation = document.getElementById('current-location');
currentlocation.addEventListener('click', (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } else {
    alert('Geolocation is not supported by this browser');
  }
});

const successFunction = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  locationTrack(lat, lon);
};

const errorFunction = (error) => {
  if (error.code === 1) {
    displayCustomError(
      'ভাই দে না! লোকেশন দিলে কিছুই হবে না ভাই 🥹 কসম করে বলতেছি 😩 আগে যদি ‘Never allow’ মাইরা থাকো, সেটিংস → সাইট পারমিশন → লোকেশন Allow কইরা দাও ভাই। না হইলে বারবার এই ডায়লগ আসবেই!😅 আর 🌦 লোকেশন Allow করলেই অটোমেটিক তোমার এলাকার ওয়েদার দেখাবে!😍'
    );
  } else {
    displayCustomError('Unable to retrieve your location at this time.');
  }
};

const locationTrack = async (lat, lon) => {
  loadingSpinner(true);
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ca49a746b15729dea42283fc51e81e0c`;
    const res = await fetch(url);
    const data = await res.json();
    localStorage.setItem('lastCity', data.name);
    displayWeatherData(data);
  } catch (error) {
    errorManager(error404);
    loadingSpinner(false);
  }
};

const savedCity = localStorage.getItem('lastCity');
if (savedCity) {
  weatherDataLoad(savedCity);
} else {
  weatherDataLoad('Dhaka');
}
