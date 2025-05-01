const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

mongoose.connect('mongodb+srv://pillaakkhash:akkhash@webdevproject.krh9hxd.mongodb.net/?retryWrites=true&w=majority&appName=webdevproject/nikhildb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error));


const bookSchema = new mongoose.Schema({
  title: String,
  author: String
});
const Books = mongoose.model('Books', bookSchema);

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/books', async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    res.status(500).send('Error fetching books');
  }
});


app.get('/books/:id', async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send('Error fetching book');
  }
});


app.post('/books', async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) return res.status(400).send('Title and author required');

    const book = new Books({ title, author });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).send('Error saving book');
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');

    if (title) book.title = title;
    if (author) book.author = author;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).send('Error updating book');
  }
});


app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Books.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running `);
});
