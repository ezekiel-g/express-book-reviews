const express = require('express')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated
const genl_routes = require('./router/general.js').general

const app = express()

app.use(express.json())

app.use(
    '/customer',
    session({
        secret: 'fingerprint_customer',
        resave: true,
        saveUninitialized: true
    })
)

app.use('/customer/auth/*', function auth(request, response, next) {
    if (request.session.authorization) {
        const token = request.session.authorization['accessToken']
        jwt.verify(token, 'access', (error, user) => {
            if (!error) {
                request.user = user
                next()
            } else {
                return response
                    .status(403).json({ message: 'User not authenticated' })
            }
        })
    } else {
        return response.status(403).json({ message: 'User not logged in' })
    }
})

const PORT = 5000

app.use('/customer', customer_routes)
app.use('/', genl_routes)

app.listen(PORT, () => console.log('Server is running'))
