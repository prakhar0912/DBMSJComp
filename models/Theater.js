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

module.exports = mongoose.model('Theater', TheaterSchema)