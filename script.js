const key = config.API_KEY

function getWeather(location) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${key}`,
        { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            console.log(processData(data))
        })
        .catch(error => console.log('ERROR'))
}

function processData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        wind: data.wind.speed
    }
}
