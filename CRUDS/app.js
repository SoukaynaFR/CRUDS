const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const app = express();
app.use(bodyParser.json());


const url = 'mongodb://127.0.0.1:27017/CRM'
const Book = require('./Models/booksModel');

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

app.get('/', (req, res) => {
  res.send('CRUD OPERATIONS :');
});

// CREATE A BOOK 

app.post('/books', async (req, res) => {
    const bookData = req.body; 
    const newBook = new Book(bookData);
  
    try {
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(500).send('Error creating book');
    }
  });



// Retrieve all books
app.get('/books', async (req, res) => {
    try {
      const books = await Book.find({});
      res.json(books);
    } catch (err) {
      console.error('Error fetching books:', err);
      res.status(500).send('Error fetching books');
    }
  });
  
  // Retrieve a single book by ID
  app.get('/books/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
  
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404).send('Book not found');
      } else {
        res.json(book);
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      res.status(500).send('Error fetching book');
    }
  });

  
  app.put('/books/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const updatedBookData = req.body;
  
    try {
      const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
      if (!updatedBook) {
        res.status(404).send('Book not found');
      } else {
        res.json(updatedBook);
      }
    } catch (err) {
      console.error('Error updating book:', err);
      res.status(500).send('Error updating book');
    }
  });

  
  app.delete('/books/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
  
    try {
      const deletedBook = await Book.findByIdAndDelete(bookId);
      if (!deletedBook) {
        res.status(404).send('Book not found');
      } else {
        res.status(204).send(); // No content (successful deletion)
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      res.status(500).send('Error deleting book');
    }
  });
  
  
  
  




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
