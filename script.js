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

function getWeather(location) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${key}&units=metric`,
        { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            const weatherObj = processData(data)
            displayData(weatherObj)
        })
        .catch(error => {
            errorMsg.style.visibility = 'visible'
        })
}

function displayData(weatherObj) {
    errorMsg.style.visibility = 'hidden'

    locationTitle.innerHTML = `${weatherObj.city}, <span class="country">${weatherObj.country}</span>`

    mainTempValue.textContent = weatherObj.currentTemp
    feelsTempValue.textContent = weatherObj.feelsTemp

    tagTitle.textContent = weatherObj.tag

    mainIcon.src = `./icons/${weatherObj.icon}.svg`

    pressureValue.innerHTML = `${weatherObj.pressure}<span class="feature__unit">hPa</span>`
    windValue.innerHTML = `${weatherObj.wind}<span class="feature__unit">m/s</span>`
    humidityValue.innerHTML = `${weatherObj.hum}<span class="feature__unit">%</span>`
}

function processData(data) {
    const currentTemp = Math.floor(data.main.temp)
    const feelsTemp = Math.ceil(data.main.feels_like)

    return {
        city: data.name,
        country: data.sys.country,
        currentTemp: currentTemp,
        feelsTemp: feelsTemp,
        hum: data.main.humidity,
        pressure: data.main.grnd_level ? data.main.grnd_level : data.main.pressure,
        wind: data.wind.speed,
        tag: data.weather[0].description,
        icon: data.weather[0].icon,
    }
}

searchForm.addEventListener('submit', searchUserWeather)

function searchUserWeather(e) {
    e.preventDefault()
    getWeather(searchInput.value)
    searchInput.value = ''
    searchInput.blur()
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

// getWeather('Amsterdam')
renderDateTime()