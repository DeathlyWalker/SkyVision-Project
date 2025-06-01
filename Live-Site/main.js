const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c", // API KEY
  base: "https://api.openweathermap.org/data/2.5/"
}

// DOM references
const userProfile = document.getElementById('userProfile');
const logoutDialog = document.getElementById('logoutDialog');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

// Show the dialog when the profile icon is clicked
userProfile.addEventListener('click', () => {
  logoutDialog.style.display = 'flex';
});

// // Confirm logout: redirect to login page
// const confirmLogout = document.getElementById('confirmLogout');

if (confirmLogout) {
  confirmLogout.addEventListener('click', () => {
    // Optional: Clear local/session storage or tokens here
    localStorage.removeItem('currentUser'); // or localStorage.clear();
    // Redirect to login page
    window.location.href = "login.html";
  });
}


// Cancel logout: hide the dialog
cancelLogout.addEventListener('click', () => {
  logoutDialog.style.display = 'none';
});


const searchbox = document.querySelector('.search-box');
const hintBar = document.getElementById('hint-bar');
const loading = document.getElementById('loading');
searchbox.addEventListener('input', showHints);
searchbox.addEventListener('keypress', setQuery);

function showHints() {
  const query = searchbox.value.trim();
  if (query.length > 2) {
    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(data => {
        const hints = data.list.map(city => city.name).slice(0, 3);  // Limit to 3 suggestions
        if (hints.length > 0) {
          hintBar.innerHTML = hints.map(city => `<li>${city}</li>`).join('');
          hintBar.style.display = 'block';

          const hintItems = hintBar.querySelectorAll('li');
          hintItems.forEach(item => {
            item.addEventListener('click', () => {
              searchbox.value = item.innerText;
              getResults(item.innerText);
              hintBar.style.display = 'none'; // Hide the suggestions after selection
            });
          });
        } else {
          hintBar.style.display = 'none';
        }
      });
  } else {
    hintBar.style.display = 'none';
  }
}

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
    hintBar.style.display = 'none';
  }
}

function getResults(query) {
  loading.style.display = 'block';  // Show loading spinner

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    })
    .then(displayResults)
    .catch(error => {
      alert('City not found, please try again.');
      loading.style.display = 'none';
    });
}

function displayResults(weather) {
  loading.style.display = 'none';  // Hide loading spinner

  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  // Additional Details
  let humidity = document.querySelector('.additional-info .humidity');
  humidity.innerText = `Humidity: ${weather.main.humidity}%`;

  let wind = document.querySelector('.additional-info .wind');
  wind.innerText = `Wind Speed: ${weather.wind.speed} km/h`;

  // Change background based on weather condition
  changeBackground(weather.weather[0].main, weather.main.temp);
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function changeBackground(weatherCondition, temperature) {
  const body = document.querySelector('body');
  let backgroundImage = '';

  if (weatherCondition === 'Clear') {
    backgroundImage = 'url("IMG/SunnyImage-2.jpeg")';  // Sunny
  } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
    backgroundImage = 'url("IMG/RainImg-1.jpeg")';  // Rain
  } else if (weatherCondition === 'Clouds') {
    backgroundImage = 'url("IMG/CloudyImg-1.jpeg")';  // Cloudy
  } else if (weatherCondition === 'Snow') {
    backgroundImage = 'url("IMG/SnowImg-2.jpeg")';  // Snow
  } else {
    backgroundImage = 'url("IMG/Fog&SnowImg-1.jpeg")';  // Default (sunny)
  }

  body.style.backgroundImage = backgroundImage;
}
