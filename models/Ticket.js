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
    screens: [{
        name: String,
        f_seats: [Number]
    }]
})

const TicketSchema = mongoose.Schema({
    show: {
        type: ShowSchema,
        required: true
    },
    customer: {
        type: mongoose.ObjectId,
        required: true
    },
    screen: {
        sc: String,
        st: Number
    },
    payment: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Ticket', TicketSchema)