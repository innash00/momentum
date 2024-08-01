import playList from "./playList.js";

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

window.addEventListener("beforeunload", setWeatherLS);
window.addEventListener("load", getWeatherLS);
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');

const currentCity = localStorage.getItem("city");

if (currentCity === '' || currentCity === 'Minsk') {
    city.value = 'Minsk';
    getWeather('Minsk');
} else {
    city.value = currentCity;
    getWeather(currentCity);
}

city.addEventListener('change', function() {
    weatherError.textContent = '';
    getWeather(city.value);
    if (weatherError === null) saveWeather();
});


getQuotes();

let isPlay = false;
const audio = new Audio;
const playListConteiner = document.querySelector('.play-list');
const player = document.querySelector(".play.player-icon");
player.addEventListener('click', playAudio);
let songNum = 0;
document.querySelector('.play-prev.player-icon').addEventListener('click', playPrev);
document.querySelector('.play-next.player-icon').addEventListener('click', playNext);
createSongList();

audio.addEventListener('ended', function() {
    playNext();
})

audio.addEventListener('loadeddata', () => {
    document.querySelector('.song-time .length').textContent = getTimeCodeFromNum(audio.duration);
    audio.volume = 0.75;
    },
    false
);

setInterval(() => {
    const progressBar = document.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    document.querySelector(".current").textContent = getTimeCodeFromNum(audio.currentTime);
  }, 500);


  const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false)

document.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = document.querySelector(".volume");
    audio.muted = !audio.muted;
    if (audio.muted) {
      volumeEl.style.backgroundImage = "url('../assets/svg/volume-off-stroke-rounded.svg')";
    } else {
        volumeEl.style.backgroundImage = "url('../assets/svg/volume.svg')";
    }
  });




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



async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=902e6e1d11453dd44d67ed646385b88a&units=metric`;
  
    temperature.textContent = '';
    weatherDescription.textContent = '';
    humidity.textContent = '';
    wind.textContent = '';
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`City not found: ${city}`);
          }
    } catch (error) {
        weatherError.textContent = 'Wrong City';
    }
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
}
    
function saveWeather() {
    setWeatherLS();
    getWeatherLS();
}

function setWeatherLS() {
    localStorage.setItem("city", city.value);
}

function getWeatherLS() {
    const cityFromLS = localStorage.getItem("city");
    if (cityFromLS !== null) {
        city.value = cityFromLS;
    }
}



  async function getQuotes() {
    const quotes = "assets/quotes.json";
    const res = await fetch(quotes);
    const data = await res.json();
    return data;
  }

(async () => {
    const quotes = await getQuotes();
    let currentIndex = getRandomNum(0, 3);

    function showQuote(index) {
        const quote = quotes[index];
        document.querySelector('.quote').textContent = `"${quote.text}"`;
        document.querySelector('.author').textContent = `${quote.author}`;
    }

    document.querySelector('.change-quote').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        showQuote(currentIndex);
    });

    showQuote(currentIndex);
})();



function playAudio () {
    audio.src = playList[songNum].src;
    if (!isPlay) {
        //audio.currentTime = 0;
        audio.play();
        isPlay = true;
        player.classList.add("pause");
    } else {
        audio.pause;
        isPlay = false;
        player.classList.remove("pause");
    }
       
    document.querySelectorAll('.play-item').forEach(song => {
        if (song.textContent === playList[songNum].title) {
            song.classList.add('active');
        } else song.classList.remove('active');
    })
}

function playNext() {
    if (songNum === 3) {
        songNum = 0;
    } else {
        songNum += 1;
    }
    isPlay = false;
    playAudio();
}

function playPrev() {
    if (songNum === 0) {
        songNum = 3;
    } else {
        songNum -= 1;
    }
    isPlay = false;
    playAudio();
}

function createSongList() {
    playList.forEach((el) => {
        const li = document.createElement("li");
        li.classList.add('play-item');
        li.textContent = el.title;
        playListConteiner.append(li);
    })
}

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
  }