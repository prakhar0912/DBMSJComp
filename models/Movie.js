const mongoose = require('mongoose')

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

module.exports = mongoose.model('Movie', MovieSchema)