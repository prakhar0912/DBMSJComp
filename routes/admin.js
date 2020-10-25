const express = require('express')
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

//Validation
const { adminValidation } = require('../validation')



router.post('/register', async (req, res) => {


    const { error } = adminValidation(req.body)

    if (error) {
        return res.json({ message: error.details[0].message })
    }

    const emailExists = await Admin.findOne({ email: req.body.email })

    if (emailExists) {
        res.status(400)
        return res.json({ message: "Email Already Exists!" })
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10, null)

    const admin = new Admin({
        email: req.body.email,
        password: hashPassword,
    })

    try {
        const savedAdmin = await admin.save()
        res.status(200)
        res.json(savedAdmin)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})



router.post('/login', async (req, res) => {
    const { error } = adminValidation(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const admin = await Admin.findOne({ email: req.body.email })

    if (!admin) {
        res.status(400)
        return res.json({ message: "Email Doesn't Exist!" })
    }

    const validPass = await bcrypt.compare(req.body.password, admin.password)

    console.log(validPass)
    if (!validPass) {
        res.status(400)
        return res.json({ message: "Wrong Password!" })
    }

    const token = jwt.sign({ _id: admin._id }, process.env.ADMIN_SECRET);

    res.header('token', token)
    res.status(200).json({ token: token })
})

router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200)
        res.json(admins)
    }
    catch (err) {
        res.status(500)
        res.json(err)
    }
})

module.exports = router;