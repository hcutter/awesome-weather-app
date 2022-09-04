let currentTime = new Date();

let newDay = document.querySelector("#day");
let newTime = document.querySelector("#time");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let currentDay = days[currentTime.getDay()];
let currentMonth = months[currentTime.getMonth()];
let currentDate = currentTime.getDate();

newDay.innerHTML = `${currentDay}, ${currentMonth} ${currentDate}`;

let hours = currentTime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currentTime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

newTime.innerHTML = `${hours}:${minutes}`;

function getForecast(coordinates) {
  let apiKey = "e487ad872752ff8b32a9f28dbc0c6d35";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function cityTemperature(response) {
  let iconElement = document.querySelector("#icon");

  fahrenheitTemp = response.data.main.temp;

  document.querySelector("#currentCity").innerHTML = response.data.name;
  document.querySelector("#tempNumber").innerHTML = Math.round(fahrenheitTemp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "e487ad872752ff8b32a9f28dbc0c6d35";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial`;
  axios.get(`${url}&appid=${apiKey}`).then(cityTemperature);
}

function citySubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;
  searchCity(city);
}

function searchCurrentLocation(position) {
  let apiKey = "e487ad872752ff8b32a9f28dbc0c6d35";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
  axios.get(url).then(cityTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#tempNumber");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let celsiusTemp = ((fahrenheitTemp - 32) * 5) / 9;
  document.querySelector("#tempNumber").innerHTML = Math.round(celsiusTemp);
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(
    "#weather-forecast-temperatures"
  );
  let forecastHTML = `
  <div class="row justify-content-center">`;

  forecast.forEach(function (forecastDays, index) {
    if (index > 0) {
      if (index < 6) {
        forecastHTML =
          forecastHTML +
          `
        <div class="col-2">
          <div class="weather-forecast-date">${formatForecastDay(
            forecastDays.dt
          )}</div>
          <img src="http://openweathermap.org/img/wn/${
            forecastDays.weather[0].icon
          }@2x.png" alt="" width="60px">
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max">${Math.round(
              forecastDays.temp.max
            )}°</span>
            |
            <span class="weather-forecast-temperature-min">${Math.round(
              forecastDays.temp.min
            )}°</span>
          </div>	
        </div>`;
      }
    }
  });

  forecastHTML =
    forecastHTML +
    `</div>
  `;

  forecastElement.innerHTML = forecastHTML;
}

let fahrenheitTemp = null;

let form = document.querySelector("#search-bar");
form.addEventListener("submit", citySubmit);

searchCity("Charleston");

let currentLocationButton = document.querySelector("#currentLocationButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);
