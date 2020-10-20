const express = require('express')
const mongoose = require('mongoose')
const Customer = require('../models/Customer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

//Validation
const { registerValidation, loginValidation } = require('../validation')



router.post('/register', async (req, res) => {


    const { error } = registerValidation(req.body)

    if (error) {
        return res.json(error.details[0].message)
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