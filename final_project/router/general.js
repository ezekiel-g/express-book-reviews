const express = require('express')
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
        if (users.find(user => user.username === username)) {
            response.send('Username unavailable')
        } else {
            users.push({ username: username, password: password })
            response.send('User registered successfully')
        }
    } else {
        response.send('Please enter a username and password')
    }
})

// Get the book list available in the shop
public_users.get('/', (request, response) => {
    response.send(JSON.stringify(books, null, 4))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (request, response) => {
    const isbn = request.params.isbn
    response.send(JSON.stringify(books[isbn], null, 4))
})

// Get book details based on author
public_users.get('/author/:author', (request, response) => {
    const author = request.params.author
    const booksByAuthor = Object.values(books).filter(book => {
        return book.author === author
    })
    console.log(booksByAuthor)
    response.send(JSON.stringify(booksByAuthor, null, 4))
})

// Get all books based on title
public_users.get('/title/:title', (request, response) => {
    const title = request.params.title
    const booksByTitle = Object.values(books).filter(book => {
        return book.title === title
    })
    console.log(booksByTitle)
    response.send(JSON.stringify(booksByTitle, null, 4))
})

//  Get book review
public_users.get('/review/:isbn', (request, response) => {
    const isbn = request.params.isbn
    const reviewsByIsbn = books[isbn].reviews
    response.send(JSON.stringify(reviewsByIsbn, null, 4))
})

module.exports.general = public_users
