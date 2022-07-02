const key = config.API_KEY
const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const locationTitle = document.querySelector('.location__title')
const mainTempValue = document.querySelector('[data-temp="main"]')
const feelsTempValue = document.querySelector('[data-temp="feels"]')
const pressureValue = document.querySelector('[data-feature="pressure"]')
const windValue = document.querySelector('[data-feature="wind"]')
const humidityValue = document.querySelector('[data-feature="humidity"]')
const tagTitle = document.querySelector('.tag_main')
const mainIcon = document.querySelector('.main__image > img')
const searchForm = document.querySelector('.header__search')
const searchInput = document.querySelector('.search-bar')
const dateTime = document.querySelector('.date')
const errorMsg = document.querySelector('.error-message')

function getCoords(location) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${key}`,
        { mode: 'cors' })
        .then(response => response.json())
        .then(location => {
            displayLocation(location)
            getWeather(location[0].lat, location[0].lon)
        })
        .catch(error => {
            errorMsg.style.visibility = 'visible'
        })
}

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${key}&units=metric`,
        { mode: 'cors' })
        .then(response => response.json())
        .then(weather => {
            const currentWeather = processCurrentWeather(weather.current)
            displayCurrentWeather(currentWeather)
            const forecast = processForecastWeather(weather.daily)
            displayForecastWeather(forecast)
        })
        .catch(error => {
            console.log(error);
        })
}

function processCurrentWeather(data) {
    return {
        currentTemp: Math.round(data.temp),
        feelsTemp: Math.round(data.feels_like),
        hum: data.humidity,
        pressure: data.grnd_level ? data.grnd_level : data.pressure,
        wind: data.wind_speed,
        tag: data.weather[0].description,
        icon: data.weather[0].icon,
    }
}

function processForecastWeather(arr) {
    // cut current day from forecast
    const newArr = arr.slice(1, arr.length)

    return newArr.map(element => {
        const date = new Date(element.dt * 1000)
        return {
            date: `${date.getDate()} ${MONTH_NAME[date.getMonth()]}`,
            day: DAY_NAME[date.getDay()],
            temp: Math.round(element.temp.day),
            hum: element.humidity,
            wind: element.wind_speed,
            pressure: element.pressure,
            icon: element.weather[0].icon,
            tag: element.weather[0].description
        }
    });
}

searchForm.addEventListener('submit', searchUserWeather)

function searchUserWeather(e) {
    e.preventDefault()
    getCoords(searchInput.value)
    searchInput.value = ''
    searchInput.blur()
}

function displayLocation(data) {
    locationTitle.innerHTML = `${data[0].name}, <span class="country">${data[0].country}</span>`
}

function displayCurrentWeather(weatherObj) {
    errorMsg.style.visibility = 'hidden'

    mainTempValue.textContent = weatherObj.currentTemp
    feelsTempValue.textContent = weatherObj.feelsTemp

    tagTitle.textContent = weatherObj.tag

    mainIcon.src = `./icons/${weatherObj.icon}.svg`

    pressureValue.innerHTML = `${weatherObj.pressure}<span class="feature__unit">hPa</span>`
    windValue.innerHTML = `${weatherObj.wind}<span class="feature__unit">m/s</span>`
    humidityValue.innerHTML = `${weatherObj.hum}<span class="feature__unit">%</span>`
}

const forecast = document.querySelector('.forecast__slider')

function displayForecastWeather(arr) {
    forecast.innerHTML = ''
    arr.forEach(day => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
        
        <div class="card__header">
                        <div class="date">${day.date}</div>
                        <div class="day">${day.day}</div>
                    </div>
                     
                    <div class="card__main">

                    <div class="card__info">
                        <div class="card__temp temp">
                            <div class="temp__value">${day.temp}</div>
                            <div class="temp__unit">
                                <span class="degree">o</span>
                                <span class="unit">C</span>
                            </div>
                        </div>
                        <div class="card__tag">${day.tag}</div>                      
                    </div>
                    <div class="card__img">
                            <img src="./icons/${day.icon}.svg" alt="${day.tag}">
                        </div>
                    </div>
                    <div class="card__details">
                        <div class="feature">
                            <div class="feature__legend">
                                <span class="feature__icon material-symbols-outlined">
                                    humidity_mid
                                </span>
                            </div>
                            <div class="feature__value" data-feature="humidity">
                                ${day.hum}<span class="feature__unit">%</span>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature__legend">
                                <span class="feature__icon material-symbols-outlined">
                                    air
                                </span>
                            </div>
                            <div class="feature__value" data-feature="wind">
                                ${day.wind}<span class="feature__unit">m/s</span>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature__legend">
                                <span class="feature__icon material-symbols-outlined">
                                    thermometer
                                </span>
                            </div>
                            <div class="feature__value" data-feature="pressure">
                                ${day.pressure}<span class="feature__unit">hPa</span>
                            </div>
                        </div>
                    </div>`
        forecast.append(card)
    });
}

function renderDateTime() {
    let currentDate = new Date()
    const month = MONTH_NAME[currentDate.getMonth()]
    const weekDay = DAY_NAME[currentDate.getDay()]
    const day = currentDate.getDate()

    const hour = currentDate.getHours()
    const minutes = currentDate.getMinutes()

    dateTime.innerHTML = `${day} ${month}, ${weekDay} | ${hour}:${minutes}`

    setInterval(renderDateTime, 1000)
}

getCoords('Amsterdam')
renderDateTime()