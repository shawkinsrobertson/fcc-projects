/*NOTES
    11.03.2026: need external weather API instead of FCC proxy to show manipulation of real-world data types, not just tutorial test data.
*/


//get weather elements
const getWeatherBtn = document.getElementById('get-weather-btn');
const locationDropDwn = document.getElementById('location-dropdown');
const unitSwitch = document.getElementById('unit-switch');
const headerDisplay = document.getElementById("location"); 

//main weather stats
const mainWeather = document.getElementById('weather-main');
const weatherIcon = document.getElementById('weather-icon');
const mainTempEl = document.getElementById('main-temperature');
const feelsLikeEl = document.getElementById('feels-like');

//secondary stats
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const gust = document.getElementById('wind-gust');

async function getWeather (city) {
  try {
    const url = `https://weather-proxy.freecodecamp.rocks/api/city/${city}`;
     const response = await fetch(url);
     const data = await response.json();
     return data;
  } catch(error) {
    console.log(error);
  }
  
};


function getCity(){
 return locationDropDwn.value;
}

function imperialOrMetric () {
  return unitSwitch.checked;
}


function getWeatherMain ([{main}]) {
  return main ?? "N/A";
}

function getIconURL([{main, icon}]) {
  if(icon == null) {return "N/A";}
  weatherIcon.alt = main;
  return icon;
}

function getTemp({ main: { temp } }) {
  if (temp == null) return "N/A";
  if (imperialOrMetric()) {
    const fahrenheit = Math.round((temp * 1.8) + 32);
    return `${fahrenheit} <span>&#176;</span>F`;
  } else {
    return `${temp} <span>&#176;</span>C`;
  }
}

function getFeels({ main: { feels_like } }) {
  if (feels_like == null) return "N/A";
  if (imperialOrMetric()) {
    const fahrenheit = Math.round((feels_like * 1.8) + 32);
    return `feels like ${fahrenheit}<span>&#176;</span>`;
  } else {
    return `feels like ${feels_like}<span>&#176;</span>`;
  }
}

function getHumidity ({ main: { humidity } }) {
    if(humidity == null) {return "N/A";}

  return `${humidity}%`;
}

function getWindSpeed({ wind: { speed } }) {
  if (speed == null) return "N/A";
  if (imperialOrMetric()) {
    const mph = Math.round(speed / 0.44704);
    return `${mph} mph`;
  } else {
    return `${speed} m/s`;
  }
}

function getGust({ wind: { gust } }) {
  if (gust == null) return "N/A";
  if (imperialOrMetric()) {
    const gustMph = Math.round(gust / 0.44704);
    return `${gustMph} mph`;
  } else {
    return `${gust} m/s`;
  }
}

async function showWeather (city) {
    const weatherData =  await getWeather(city);

    if (!weatherData || weatherData.error) {
    return undefined;
  }
    const mainWeatherArr = weatherData.weather;
  try {  
    headerDisplay.textContent = weatherData.name;
    mainWeather.textContent = getWeatherMain(mainWeatherArr);
    weatherIcon.src = getIconURL(mainWeatherArr);
    mainTempEl.innerHTML = getTemp(weatherData);
    feelsLikeEl.innerHTML = getFeels(weatherData);
    humidity.textContent = getHumidity(weatherData);
    wind.textContent = getWindSpeed(weatherData);
    gust.textContent = getGust(weatherData);


    console.log(weatherData)
    return weatherData

  } catch(error) {
    console.log(error);
  }
  

}

// event listeners

locationDropDwn.addEventListener("change", () => {
  const city = getCity();
  console.log(city);
  getWeather(city);
});

getWeatherBtn.addEventListener("click", async () => {
  console.log("clicked");
  const city = getCity();
  console.log("city:", city);
  const result = await showWeather(city);
  if(!result) {
    alert("Something went wrong, please try again later");
  }
});

unitSwitch.addEventListener("change", () => {
  imperialOrMetric();
  const city = getCity();
  showWeather(city);
  });
