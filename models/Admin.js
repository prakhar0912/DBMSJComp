const mongoose = require('mongoose')
const { model } = require('./Show')

const AdminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', AdminSchema)