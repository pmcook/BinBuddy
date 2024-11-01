const mongoose = require('mongoose');

// Create a schema for the items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true }, // Ensure this field exists
  imageUrl: { type: String } // Optional: To store the URL separately if needed
});

// Create a model based on the schema
module.exports = mongoose.model('Item', itemSchema);

