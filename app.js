const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config');

//Import Routes
const MovieRoute = require('./routes/movie')
const TheaterRoute = require('./routes/theater')
const ShowRoute = require('./routes/show')
const CustomerRoute = require('./routes/customer')
const TicketRoute = require('./routes/ticket')
const AdminRoute = require('./routes/admin')


const app = express();
const uri = "mongodb://localhost:27017/testing"

app.use(bodyParser.json())

//routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*')
        return res.status(200).json({})
    }
    next()
})
app.use('/movie', MovieRoute)
app.use('/theater', TheaterRoute)
app.use('/show', ShowRoute)
app.use('/customer', CustomerRoute)
app.use('/ticket', TicketRoute)
app.use('/admin', AdminRoute)


console.log(new Date())
console.log(new Date(new Date() - (1000 * 60 * 60 * 24 * 365 * 18)));


app.get("/", (req, res) => {
    res.send("This is the home page")
})

//connect to the DB
mongoose.connect(uri, { useUnifiedTopology: true }, (err) => {
    if (err) console.error(err)
    else console.log('connected!')
})

app.listen(3000)