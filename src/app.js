const path = require("path")
const express = require("express")
const hbs = require("hbs")

const chalk = require("chalk")

const geoCode = require("./utils/geocode")
const foreCast = require("./utils/forecast")

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Bathandwa Lolwana"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Bathandwa Lolwana"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        helpText: "This is the help page",
        title: "Help",
        name: "Bathandwa Lolwana"
    })
})

app.get("/weather", (req, res) => {
    const address = req.query.address
    
    if (!address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    geoCode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        
        foreCast(latitude, longitude, (error, forcecastData) => {
            if (error) {
                return res.send({ error })
            }
            
            res.send({
                forecast: forcecastData,
                location,
                address
            })
        })
        
    })

    // res.send({
    //     forecast: "It's snowing",
    //     location: "Philedelphia",
    //     address: req.query.address
    // })
})

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        errorMessage: "Help article not found",
        title: "404",
        name: "Bathandwa Lolwana"
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        errorMessage: "Page not found.",
        title: "404",
        name: "Bathandwa Lolwana"
    })
})

app.listen(port, () => {
    console.log(chalk.green(`\nServer is up on port ${port}.\n`))
})