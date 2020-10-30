const request = require('postman-request')
const weatherstack_token = "a4bd742af998b31e6d3df1731f95ebeb"

const forecast = (latitude, longitude, callback) => {
	const url = "http://api.weatherstack.com/current?access_key="+weatherstack_token+"&query=" + latitude + ',' + longitude + "&units=m"
	request({url, json:true}, (error, response, body) => {
		if (error) {
			callback('Unable to connect to weather service!', undefined)
		} else if (body.error) {
			callback('Unable to find location', undefined)
		} else {
			callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + '°C (feels like ' + body.current.feelslike + '°C). There is a ' + body.current.precip + '% chance that it will rain. The humidity is ' + body.current.humidity + '%.')
		}
	})
}

module.exports = forecast