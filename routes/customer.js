const express = require('express')
const mongoose = require('mongoose')
const Customer = require('../models/Customer')
const Ticket = require('../models/Ticket')
const { auth } = require('./verify');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

//Validation
const { registerValidation, loginValidation } = require('../validation');
const { custom } = require('@hapi/joi');



router.post('/register', async (req, res) => {


    const { error } = registerValidation(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const emailExists = await Customer.findOne({ email: req.body.email })

    if (emailExists) {
        res.status(400)
        return res.json({ message: "Email Already Exists!" })
    }

    // const salt = await bcrypt.gentSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, 10, null)

    const customer = new Customer({
        email: req.body.email,
        password: hashPassword,
        sex: req.body.sex,
        name: req.body.name,
        dob: new Date(req.body.dob)
    })

    try {
        const savedCustomer = await customer.save()
        res.status(200)
        res.json(savedCustomer)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})


router.patch('/', auth, async (req, res) => {

    const customer = await Customer.findById(req.user._id)

    customer.email = req.body.email
    customer.sex = req.body.sex
    customer.name = req.body.name

    await customer.save()

    res.status(200).json(customer)
})



router.get('/tickets', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ customer: req.user._id })
        res.status(200)
        res.json(tickets)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

router.get('/spec', auth, async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
        res.status(200)
        res.json(customer)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }

})


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const customer = await Customer.findOne({ email: req.body.email })

    if (!customer) {
        res.status(400)
        return res.json({ message: "Email Doesn't Exist!" })
    }

    const validPass = await bcrypt.compare(req.body.password, customer.password)
    console.log(validPass)
    if (!validPass) {
        res.status(400)
        return res.json({ message: "Wrong Password!" })
    }
    const token = jwt.sign({ _id: customer._id }, process.env.TOKEN_SECRET);

    res.header('token', token)
    res.status(200).json({ token: token })
})

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find()
        res.status(200)
        res.json(customers)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

module.exports = router;