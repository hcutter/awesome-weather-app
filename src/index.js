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

function cityTemperature(response) {
  let iconElement = document.querySelector("#icon");

  celsiusTemp = response.data.main.temp;

  document.querySelector("#currentCity").innerHTML = response.data.name;
  document.querySelector("#tempNumber").innerHTML = Math.round(celsiusTemp);
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
}

function searchCity(city) {
  let apiKey = "e487ad872752ff8b32a9f28dbc0c6d35";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${url}&appid=${apiKey}`).then(cityTemperature);
}

function citySubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;
  searchCity(city);
}

function searchCurrentLocation(position) {
  let apiKey = "e487ad872752ff8b32a9f28dbc0c6d35";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(url).then(cityTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#tempNumber");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  document.querySelector("#tempNumber").innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let form = document.querySelector("#search-bar");
form.addEventListener("submit", citySubmit);

searchCity("Charleston");

let currentLocationButton = document.querySelector("#currentLocationButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);
