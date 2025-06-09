const api = {
  key: "86904376bcd14978b4471045250906",
  base: "https://api.weatherapi.com/v1/"
}

// DOM references
const userProfile = document.getElementById('userProfile');
const logoutDialog = document.getElementById('logoutDialog');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

userProfile.addEventListener('click', () => {
  logoutDialog.style.display = 'flex';
});

if (confirmLogout) {
  confirmLogout.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
  });
}

cancelLogout.addEventListener('click', () => {
  logoutDialog.style.display = 'none';
});

const searchbox = document.querySelector('.search-box');
const hintBar = document.getElementById('hint-bar');
const loading = document.getElementById('loading');
searchbox.addEventListener('input', showHints);
searchbox.addEventListener('keypress', setQuery);

// Show suggestions
function showHints() {
  const query = searchbox.value.trim();
  if (query.length > 2) {
    fetch(`${api.base}search.json?key=${api.key}&q=${query}`)
      .then(res => res.json())
      .then(data => {
        const hints = data.map(city => city.name).slice(0, 3);
        if (hints.length > 0) {
          hintBar.innerHTML = hints.map(city => `<li>${city}</li>`).join('');
          hintBar.style.display = 'block';

          const hintItems = hintBar.querySelectorAll('li');
          hintItems.forEach(item => {
            item.addEventListener('click', () => {
              searchbox.value = item.innerText;
              getResults(item.innerText);
              hintBar.style.display = 'none';
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
  loading.style.display = 'block';

  fetch(`${api.base}current.json?key=${api.key}&q=${query}`)
    .then(res => res.json())
    .then(displayResults)
    .catch(error => {
      alert('City not found, please try again.');
      loading.style.display = 'none';
    });
}

function displayResults(data) {
  loading.style.display = 'none';

  const weather = data.current;
  const location = data.location;

  document.querySelector('.location .city').innerText = `${location.name}, ${location.country}`;

  let now = new Date();
  document.querySelector('.location .date').innerText = dateBuilder(now);

  document.querySelector('.current .temp').innerHTML = `${Math.round(weather.temp_c)}<span>°c</span>`;
  document.querySelector('.current .weather').innerText = weather.condition.text;
  document.querySelector('.hi-low').innerText = `Feels like: ${Math.round(weather.feelslike_c)}°c`;

  document.querySelector('.additional-info .humidity').innerText = `Humidity: ${weather.humidity}%`;
  document.querySelector('.additional-info .wind').innerText = `Wind Speed: ${weather.wind_kph} km/h`;

  changeBackground(weather.condition.text, weather.temp_c);
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function changeBackground(condition, temperature) {
  const body = document.querySelector('body');
  let backgroundImage = '';

  if (condition.includes('Sunny') || condition.includes('Clear')) {
    backgroundImage = 'url("IMG/SunnyImage-2.jpeg")';
  } else if (condition.includes('Rain') || condition.includes('Drizzle')) {
    backgroundImage = 'url("IMG/RainImg-1.jpeg")';
  } else if (condition.includes('Cloud')) {
    backgroundImage = 'url("IMG/CloudyImg-1.jpeg")';
  } else if (condition.includes('Snow')) {
    backgroundImage = 'url("IMG/SnowImg-2.jpeg")';
  } else {
    backgroundImage = 'url("IMG/Fog&SnowImg-1.jpeg")';
  }

  body.style.backgroundImage = backgroundImage;
}
