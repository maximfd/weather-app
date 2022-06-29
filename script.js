const key = config.API_KEY

const locationTitle = document.querySelector('.location__title')
const mainTempValue = document.querySelector('[data-temp="main"]')
const feelsTempValue = document.querySelector('[data-temp="feels"]')
const pressureValue = document.querySelector('[data-feature="pressure"]')
const windValue = document.querySelector('[data-feature="wind"]')
const humidityValue = document.querySelector('[data-feature="humidity"]')
const tagTitle = document.querySelector('.tag_main')
const mainIcon = document.querySelector('.main__image > img')

function getWeather(location) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${key}&units=metric`,
        { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            const weatherObj = processData(data)
            displayData(weatherObj)
        })
        .catch(error => console.log('ERROR'))
    // TODO meaningful error message
}

function displayData(weatherObj) {
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

getWeather('Amsterdam')