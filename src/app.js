const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs') // templating engine for dynamic pages
app.set('views', viewsPath) // custom directory
hbs.registerPartials(partialsPath) // registerPartials route us to where partials are

// Setup static directory to serve
app.use(express.static(publicDirectory))

app.get('', (req, res) => { // setting up route
	res.render('index', {
		title: 'Weather',
		name: 'Nopi'
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Nopi'
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		helpText: 'This is some helpful text.',
		name: 'Nopi'
	})
})

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "You must provide an address!"
		})
	}

	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if (error) {
			return res.send({ error })
		} 
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			})
		})
	})	
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term!'
		})
	}
	
	console.log(req.query)
	res.send({
		products: []
	})
})

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: "Nopi",
		errorMessage: "Help article not found."
	})
})

app.get('*', (req, res) => { // Match anything that hasn't been matched so far
	res.render('404', {
		title: '404',
		name: "Nopi",
		errorMessage: "Page not found."
	})
})

app.listen(3000, () => {
	console.log('Server is up on port 3000.')
})