const express = require('express');
const mongoose = require('mongoose');
const app = express();
const itemsRouter = require('./routes/items');
const Item = require('./models/Item'); // Adjust the path as needed
const fs = require('fs');
const path = require('path'); // Add this line
const ExcelJS = require('exceljs');

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

// Export route
// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.get('/export-database', async (req, res) => {
  try {
    const items = await Item.find();

    // Initialize a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Items');

    // Set up columns in the Excel file
    worksheet.columns = [
      { header: 'name', key: 'name', width: 20 },
      { header: 'location', key: 'location', width: 20 },
      { header: 'image', key: 'photo', width: 30 },
    ];

    // Add rows to the worksheet
    items.forEach(item => {
      // Extract just the filename for the photo field
      const photoFileName = item.image ? path.parse(path.basename(item.image)).name : 'NOPHOTO';
      worksheet.addRow({
        name: item.name,
        location: item.location,
        photo: photoFileName,
      });
    });

    // Path for the export file
    const filePath = path.join(__dirname, 'uploads', 'database-export.xlsx');

    // Write Excel file to the specified path
    await workbook.xlsx.writeFile(filePath);

    // Send the file to the client for download
    res.download(filePath, 'database-export.xlsx', (err) => {
      if (err) {
        console.error('Error during file download:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).send('Error exporting database');
  }
});