const express = require('express')
const mongoose = require('mongoose')
const Ticket = require('../models/Ticket')
const Show = require('../models/Show')
const Customer = require('../models/Customer')
const { auth, adminAuth } = require('./verify');
const router = express.Router()

router.post('/', auth, async (req, res) => {

    const resShow = await Show.findById(req.body.show)

    let errString = "";
    let isErr = 0;
    if (resShow == null) {
        errString += "There is no such Show. ";
        isErr++;
    }
    if (isErr != 0) {
        res.status(400)
        res.json({ message: errString })
        return
    }

    let screenIndex = resShow.screens.findIndex(({ name }) => name == req.body.screen.sc)
    let seatIndex
    if (screenIndex != -1) {
        seatIndex = resShow.screens[screenIndex].f_seats.findIndex((num) => num == req.body.screen.st)
    }
    else {
        res.status(400)
        res.json({ message: "No such Screen" })
        return
    }
    if (seatIndex == -1) {
        res.status(400)
        res.json({ message: "Sorry this seat is not available!" })
        return
    }


    const ticket = new Ticket({
        show: resShow,
        customer: req.user._id,
        screen: {
            sc: req.body.screen.sc,
            st: req.body.screen.st
        },
        date: new Date()
    })

    try {
        const resCustomer = await Customer.findById(req.user._id)
        const savedTicket = await ticket.save()
        resShow.screens[screenIndex].f_seats.splice(seatIndex, 1)
        await resShow.save()
        resCustomer.tickets.push(savedTicket._id)
        await resCustomer.save()
        res.status(200)
        res.json(savedTicket)
    }
    catch (err) {
        res.status(500)
        res.json({ message: err })
    }
})

router.delete('/delete', auth, async (req, res) => {
    try {
        const tickets = await Ticket.findById(req.query.id)
        const show = await Show.findById(tickets.show._id)
        let screenIndex = show.screens.findIndex(({ name }) => name == tickets.screen.sc)
        show.screens[screenIndex].f_seats.push(tickets.screen.st)
        await show.save()
        const ticket = await Ticket.findByIdAndDelete(req.query.id)
        res.status(200)
        res.json(ticket)
    }
    catch (err) {
        res.status(500)
        res.json({ message: err })
    }
})

router.get('/', adminAuth, async (req, res) => {
    try {
        const tickets = await Ticket.findById(req.user._id)
        res.status(200)
        res.json(tickets)
    }
    catch (err) {
        res.status(500)
        res.json({ message: err })
    }
})

module.exports = router;