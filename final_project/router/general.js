
const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Axios helper: retrieves data from an existing public API endpoint
const getBookListAsync = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered'
    });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const result = [];

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
            result.push(books[isbn]);
        }
    });

    return res.status(200).json(result);
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const result = [];

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
            result.push(books[isbn]);
        }
    });

    return res.status(200).json(result);
});

// Task 5: Get reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

// Task 10: Get all books using Axios and async/await
public_users.get('/async', async (req, res) => {
    try {
        const result = await getBookListAsync('http://localhost:5000/');
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    }
});

// Task 11: Get book by ISBN using Axios and Promises
public_users.get('/async/isbn/:isbn', (req, res) => {
    const url = `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`;

    getBookListAsync(url)
        .then((result) => res.status(200).json(result))
        .catch((error) => {
            const status = error.response ? error.response.status : 500;
            return res.status(status).json({
                message: status === 404 ? 'Book not found' : 'Error retrieving book'
            });
        });
});

// Task 12: Get books by author using Axios and async/await
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const url = `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`;
        const result = await getBookListAsync(url);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by author'
        });
    }
});

// Task 13: Get books by title using Axios and async/await
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const url = `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`;
        const result = await getBookListAsync(url);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by title'
        });
    }
});

module.exports.general = public_users;
