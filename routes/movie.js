const express = require('express')
const mongoose = require('mongoose')
const Theater = require('../models/Theater')
const Movie = require('../models/Movie')
const auth = require('./verify');
const router = express.Router()

router.post('/', auth, async (req, res) => {

    const movie = new Movie({
        name: req.body.name,
        lang: req.body.lang,
        rating: req.body.rating
    })

    try {
        const savedMovie = await movie.save()
        res.status(200)
        res.send(savedMovie)
    }
    catch (err) {
        res.status(500)
        res.send(err)
    }
})

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
        res.status(200)
        res.json(movies)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

module.exports = router;