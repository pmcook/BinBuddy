const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item'); // Adjust this path as needed
const router = express.Router();
const fs = require('fs');
const XLSX = require('xlsx');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    // Assign a temporary filename before handling in the route
    const tempFileName = file.originalname; // Store the original filename temporarily
    cb(null, tempFileName); // Use original filename temporarily; real naming happens in the route
  }
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// List of allowed image extensions to check
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

// Helper function to check for available image file with any extension
function findImagePath(imageName) {
  for (const ext of allowedExtensions) {
    const imagePath = path.join('uploads', `${imageName}${ext}`);
    if (fs.existsSync(imagePath)) {
      return `/uploads/${imageName}${ext}`;
    }
  }
  return '/uploads/NOPHOTO.jpg';
}


// Route to download the Excel template
router.get('/download-template', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/template.xlsx'); // Adjust the path to your template file
  res.download(filePath, 'template.xlsx'); // This will prompt the user to download the file
});



// Route to upload the Excel file
router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path); // Read the uploaded Excel file
    const sheetName = workbook.SheetNames[0]; // Get the first sheet name
    const worksheet = workbook.Sheets[sheetName];
    const items = XLSX.utils.sheet_to_json(worksheet); // Convert the sheet data to JSON

    // Loop through each row in the Excel file
    for (const item of items) {
      // Ensure `item.image` is a string before trimming, or use 'NOPHOTO'
      const imageName = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : 'NOPHOTO';


      // Find the correct image path or use the default path
      const finalImagePath = findImagePath(imageName);

      // Create new item in the database with the determined image path
      const newItem = new Item({
        name: item.name,
        location: item.location,
        image: finalImagePath, // Assign the final image path here
      });

      // Log the newItem before saving
      console.log(`Saving item to DB:`, newItem);
      await newItem.save();
    }

    res.status(200).send('Bulk upload successful');
  } catch (error) {
    console.error("Error during bulk upload:", error);
    res.status(500).send('Error processing bulk upload');
  } finally {
    // Remove the uploaded Excel file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting uploaded Excel file:", err);
      else console.log('Uploaded Excel file successfully deleted');
    });
  }
});




// Route to add a new item
router.post('/', upload.single('image'), async (req, res) => {
  let imagePath = '/uploads/NOPHOTO.jpg'; // Default path if no image uploaded
  console.log("Request Body:", req.body); // Log request body
  console.log("Uploaded File:", req.file); // Log uploaded file info

  // Check if a file was uploaded and assign the filename based on name
  if (req.file) {
      const itemName = req.body.name.replace(/\s+/g, '-');
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${itemName}${fileExtension}`;
      const oldPath = path.join('uploads', req.file.filename);
      const newPath = path.join('uploads', newFileName);
      
      fs.renameSync(oldPath, newPath);
      imagePath = `/uploads/${newFileName}`;
  }

  try {
      const newItem = new Item({
          name: req.body.name,
          location: req.body.location,
          image: imagePath, // Use the determined image path
      });
      await newItem.save();
      res.status(201).send('Item added successfully');
  } catch (error) {
      console.error("Error adding item:", error);
      res.status(400).send('Bad Request');
  }
});



// Route to get all items
// Fetch items and send them back as a response
router.get('/', async (req, res) => {
  const items = await Item.find();
  res.json(items); // This sends the image path as part of the item data
});



// Route to delete an item by ID
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content to return
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
});

// Route to update an item by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      location: req.body.location,
    };

    // Only add the image if a new one was uploaded
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.status(200).send('Item updated successfully');
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send('Internal Server Error');
  }
});


// Route to modify an item by ID
const mongoose = require('mongoose'); // Ensure mongoose is imported

router.get('/:id', async (req, res) => {
  console.log("Fetching item with ID:", req.params.id);
  try {
    // Use `new mongoose.Types.ObjectId(...)` to create a valid ObjectId
    const item = await Item.findById(new mongoose.Types.ObjectId(req.params.id));
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
