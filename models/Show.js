const mongoose = require('mongoose')


const TheaterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    screens: [
        {
            name: String,
            seats: Number
        }
    ]
})

const MovieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
})


const ShowSchema = mongoose.Schema({
    theater: {
        type: TheaterSchema,
        required: true
    },
    movie: {
        type: MovieSchema,
        required: true
    },
    s_date: {
        type: Date,
        required: true
    },
    e_date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    screens: [{
        name: String,
        f_seats: [Number]
    }]
})

module.exports = mongoose.model('Show', ShowSchema)