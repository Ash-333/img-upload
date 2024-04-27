require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configure multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'app_uploads',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

const parser = multer({ storage: storage });

const app = express();

// POST route for uploading an image
app.post('/upload', parser.single('image'), (req, res) => {
  try {
    // The image is now in Cloudinary and the URL is available
    // through req.file.path
    const imageUrl = req.file.path;
    res.status(200).json({
      message: 'Image uploaded successfully!',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to upload image',
      error: error
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});