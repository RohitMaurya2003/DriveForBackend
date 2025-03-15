const express = require('express');
const { upload } = require('../config/cloudinaryConfig');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const fileModel = require('../models/files.models');

// Route to handle file uploads
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log("Decoded Token:", req.user); // Debugging

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing in request" });
    }

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please upload an image file." });
    }

    console.log("Received file data:", req.file); // Debugging

    // Create a new file entry in MongoDB
    const newFile = new fileModel({
      filename: req.file.originalname,
      path: req.file.path,
      user: req.user._id, // Use _id instead of userId
    });

    // Save the file to MongoDB
    await newFile.save();
    console.log("File saved successfully:", newFile);

    // Respond with success message and file details
    res.json({ message: 'File uploaded successfully', file: newFile });

  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "An error occurred while uploading the file. Please try again later.", error: error.message });
  }
});

// Route to handle file downloads
router.get('/download/:path', authMiddleware, async (req, res) => {
    try {
      const loggedInUserId = req.user._id; // Use _id instead of userId
      const path = decodeURIComponent(req.params.path); // Decode the URL
  
      console.log("Querying for file with path:", path); // Debugging
  
      // Find the file in MongoDB
      const file = await fileModel.findOne({
        user: loggedInUserId,
        path: path,
      });
  
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      // Redirect to the Cloudinary URL for download
      res.redirect(file.path);
  
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "An error occurred while downloading the file.", error: error.message });
    }
  });




module.exports = router;