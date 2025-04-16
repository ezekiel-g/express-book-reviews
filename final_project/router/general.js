const express = require('express')
const axios = require('axios')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (request, response) => {
    const username = String(request.body.username).toLowerCase()
    const password = String(request.body.password)

    if (
        username.trim().length > 0
        && password.trim().length > 0
    ) {
        if (!isValid(username)) {
            response.status(409).json({ message: 'Username unavailable' })
        } else {
            users.push({ username: username, password: password })
            response.status(200).json({ message: 'User registered successfully' })
        }
    } else {
        response.status(400).json({ message: 'Please enter a username and password' })
    }
})

// Get the book list available in the shop
public_users.get('/', (request, response) => {
    response.status(200).send(JSON.stringify(books, null, 4))
})

// Get the book list using Axios from the endpoint immediately above
public_users.get('/using-axios', async (request, response) => {
    try {
        const axiosResponse = await axios.get('http://localhost:5000/')
        response.status(axiosResponse.status).json(axiosResponse.data)
    } catch (error) {
        console.error('Error in fetch: ', error)
        response.status(500).json({ error })
    }
})

// Get book details by ISBN using a promise
public_users.get('/isbn/:isbn', (request, response) => {
    const isbn = request.params.isbn
    new Promise((resolve, reject) => {
        books[isbn] ? resolve(books[isbn]) : reject('Not found')
    })
    .then(result => {
        response.status(200).send(JSON.stringify(result, null, 4))
    })
    .catch(error => {
        console.error('Error: ', error)
        response.status(404).json({ error: error })
    })
})

// Get book details by author using a promise
public_users.get('/author/:author', (request, response) => {
    const author = request.params.author
    new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => {
            return book.author === author
        })
        booksByAuthor.length > 0 ? resolve(booksByAuthor) : reject('Not found')
    })
    .then(result => {
        response.status(200).send(JSON.stringify(result, null, 4))
    })
    .catch(error => {
        console.error('Error: ', error)
        response.status(404).json({ error: error })
    })
})

// Get book details by title using a promise
public_users.get('/title/:title', (request, response) => {
    const title = request.params.title
    new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter(book => {
            return book.title === title
        })
        booksByTitle.length > 0 ? resolve(booksByTitle) : reject('Not found')
    })
    .then(result => {
        response.status(200).send(JSON.stringify(result, null, 4))
    })
    .catch(error => {
        console.error('Error: ', error)
        response.status(404).json({ error: error })
    })
})

//  Get book reviews by ISBN using a promise
public_users.get('/review/:isbn', (request, response) => {
    new Promise((resolve, reject) => {
        const isbn = request.params.isbn
        const reviewsByIsbn = books[isbn].reviews
        reviewsByIsbn ? resolve(reviewsByIsbn) : reject('Not found')
    })
    .then(result => {
        response.status(200).send(JSON.stringify(result, null, 4))
    })
    .catch(error => {
        console.error('Error: ', error)
        response.status(404).json({ error: error })
    })
})

module.exports.general = public_users
