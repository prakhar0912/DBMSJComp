const express = require('express')
const mongoose = require('mongoose')
const Theater = require('../models/Theater')
const { route } = require('./movie')
const { auth, adminAuth } = require('./verify');
const router = express.Router()

router.post('/', adminAuth, async (req, res) => {

    const theater = new Theater({
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        screens: req.body.screens
    })

    try {
        const savedTheater = await theater.save()
        res.status(200)
        res.send(savedTheater)
    }
    catch (err) {
        res.status(500)
        res.send(err)
    }
})

router.get('/', adminAuth, async (req, res) => {
    try {
        const theaters = await Theater.find()
        res.status(200)
        res.json(theaters)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

module.exports = router;