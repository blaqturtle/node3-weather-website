const request = require("request")

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=d8b2855fb387c3a534613901f458e008&query=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&units=f`
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to weather service!", undefined)
        } else if (body.error) {
            callback("Unable to find location!", undefined)
        } else {
            const forecastString = `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} out. It feels like ${body.current.feelslike} degrees out. The humidity is ${body.current.humidity}%.`
            callback(undefined, forecastString)
        }
    })
}

module.exports = forecast