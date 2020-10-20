const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    reg_date: {
        type: Date,
        default: Date.now
    },
    tickets: {
        type: [mongoose.ObjectId]
    }
})

module.exports = mongoose.model('Customer', CustomerSchema)