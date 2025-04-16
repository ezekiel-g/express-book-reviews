const express = require('express')
const jwt = require('jsonwebtoken')
const session = require('express-session')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = [
    { username: 'tomjones', password: 'abc123' }
]

const isValid = username => {
    return !users.find(user => user.username === username)
}

const authenticatedUser = (username, password) => {
    username = username.toLowerCase()
    return users.find(
        user => user.username === username && user.password === password
    ) !== undefined
}

//only registered users can login
regd_users.post('/login', (request, response) => {
    const username = String(request.body.username).toLowerCase()
    const password = String(request.body.password)

    if (
        username.trim().length > 0
        && password.trim().length > 0
    ) {
        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign(
                {
                    data: password
                },
                'access',
                { expiresIn: 60 }
            )

            request.session.authorization = { accessToken, username }

            return response.status(200).json({ message: 'User logged in successfully' })
        } else {
            return response.status(400).json({ message: 'Invalid username and/or password' })
        }
    }
})

// Add a book review
regd_users.put('/auth/review/:isbn', (request, response) => {
    const isbn = request.params.isbn
    const username = request.session.authorization.username
    const review = request.query.review

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            books[isbn].reviews[username] = review
            response.status(200).json({ message: 'Review updated successfully' })
        } else {
            books[isbn].reviews[username] = review
            response.status(200).json({ message: 'Review added successfully' })
        }
    } else {
        response.status(404).json({ message: 'Not found' })
    }
})

regd_users.delete('/auth/review/:isbn', (request, response) => {
    const isbn = request.params.isbn
    const username = request.session.authorization.username

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username]
            response.status(200).json({ message: 'Review deleted successfully' })
        } else {
            response.status(404).json({ message: 'Not found' })
        }            
    } else {
        response.status(404).json({ message: 'Not found' })
    }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
