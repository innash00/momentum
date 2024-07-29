const time = document.querySelector(".time");
const justDate = document.querySelector(".date");
const greeting = document.querySelector('.greeting');
const date = new Date();
const hours = date.getHours();
showTime();

window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);

let randomNum = getRandomNum(1, 20);
const userName = document.querySelector('.name');
userName.addEventListener('focus', saveName);

setBg();

const slideNext = document.querySelector('.slide-next.slider-icon');
const slidePrev = document.querySelector('.slide-prev.slider-icon');
slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
getWeather();

const city = document.querySelector('.city');
city.addEventListener('change', getWeather);

getQuotes();

function showTime() {
    const date = new Date();
    const hours = date.getHours();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
}

function showDate() {
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    const currentDate = date.toLocaleDateString('en-US', options);
    justDate.textContent = currentDate;
}

function showGreeting() {
    const timeOfDay = getTimeOfDay(hours);
    greeting.textContent = `Good ${timeOfDay},`;
}

function getTimeOfDay(gap) {
    if (gap >= 0 && gap < 6) {
        return "night";
    } else if (gap >= 6 && gap < 12) {
        return "morning";
    } else if (gap >= 12 && gap < 18) {
        return "afternoon";
    } else {
        return "evening";
    }
}

function saveName() {
    setLocalStorage();
    getLocalStorage();
}

function setLocalStorage() {
    localStorage.setItem("name", userName.value);
}

function getLocalStorage() {
    const nameFromLS = localStorage.getItem("name");
  
    if (nameFromLS !== null) {
        userName.value = nameFromLS;
    }
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setBg() {
    const justTime = getTimeOfDay(hours);
    let newRandomNum = randomNum.toString().padStart(2, "0");

    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${justTime}/${newRandomNum}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url('${img.src}')`;
    }
}

function getSlideNext() {
    if (randomNum === 20) {
        randomNum = 1;
    } else {
        randomNum += 1;
    }
    setBg();
}

function getSlidePrev() {
    if (randomNum === 1) {
        randomNum = 20;
    } else {
        randomNum -= 1;
    }
    setBg();
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=902e6e1d11453dd44d67ed646385b88a&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
  }

  async function getQuotes() {
    const quotes = "quotes.json";
    const res = await fetch(quotes);
    const data = await res.json();
    return data;
  }
 
  function showQuote() {
    const data = getQuotes();
    let index = 0;
    const quote = data[index];
    console.log(quote);
    console.log(data);
    document.querySelector('.quote').textContent = quote.text;
    document.querySelector('.author').textContent = quote.author;
}

showQuote();