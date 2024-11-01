const express = require('express');
const mongoose = require('mongoose');
const app = express();
const itemsRouter = require('./routes/items');

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .then(() => console.log('To close type CTRL-C'))
  .catch(err => console.error('MongoDB connection error, is it running?:', err));

// Routes
app.use('/items', itemsRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
