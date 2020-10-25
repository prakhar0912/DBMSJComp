const express = require('express')
const mongoose = require('mongoose')
const Theater = require('../models/Theater')
const Movie = require('../models/Movie')
const { adminAuth } = require('./verify');
const router = express.Router()

router.post('/', adminAuth, async (req, res) => {

    if (req.body.rating > 10) {
        res.status(400).json({ message: "Rating has to be out of 10!" })
    }

    const movie = new Movie({
        name: req.body.name,
        lang: req.body.lang,
        rating: req.body.rating
    })

    try {
        const savedMovie = await movie.save()
        res.status(200)
        res.json(savedMovie)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

router.get('/', adminAuth, async (req, res) => {
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