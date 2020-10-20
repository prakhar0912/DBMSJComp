const express = require('express')
const mongoose = require('mongoose')
const Theater = require('../models/Theater')
const Show = require('../models/Show')
const Movie = require('../models/Movie')
const auth = require('./verify')
const router = express.Router()

router.post('/', auth, async (req, res) => {
    const resTheater = await Theater.findById(req.body.theater);
    const resMovie = await Movie.findById(req.body.movie);

    let errString = "";
    let isErr = 0;
    if (resTheater == null) {
        errString += "There is no such Theater. ";
        isErr++
    }
    if (resMovie == null) {
        errString += "There is no such Movie";
        isErr++;
    }
    if (isErr != 0) {
        res.status(400)
        res.send({ message: errString })
        return
    }

    const show = new Show({
        theater: resTheater,
        movie: resMovie,
        s_date: new Date(req.body.s_date),
        e_date: new Date(req.body.e_date),
        price: req.body.price,
        screens: req.body.screens
    })

    try {
        const savedShow = await show.save()
        res.status(200)
        res.send(savedShow)
    }
    catch (err) {
        res.status(500)
        res.send(err)
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const shows = await Show.find()
        res.status(200)
        res.json(shows)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

router.get('/spec', auth, async (req, res) => {
    try {
        const show = await Show.findById(req.query.id)
        res.status(200)
        res.json(show)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

module.exports = router;