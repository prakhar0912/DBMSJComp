const jwt = require('jsonwebtoken')

let auth = (req, res, next) => {
    const token = req.header('token')
    if (!token) {
        return res.status(401).send('Acess Denied!')
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;
        next()
    }
    catch (err) {
        res.status(400).send('Invalid Token!')
    }
}

let adminAuth = (req, res, next) => {
    const token = req.header('token')
    if (!token) {
        return res.status(401).send('Acess Denied!')
    }

    try {
        const verified = jwt.verify(token, process.env.ADMIN_SECRET)
        req.user = verified;
        next()
    }
    catch (err) {
        res.status(400).send('Invalid Token!')
    }
}

module.exports.adminAuth = adminAuth
module.exports.auth = auth