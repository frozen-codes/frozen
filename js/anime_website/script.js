// API key for OpenWeatherMap (replace with your key)
const API_KEY = 'b7c613791d9030103a0d89f604532a7a';

// Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Fetch weather data
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();

    // Update DOM
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = data.main.temp;
    condition.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed;
  } catch (error) {
    alert(error.message);
  }
}

// Event Listener
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert('Please enter a city name!');
  }
});
