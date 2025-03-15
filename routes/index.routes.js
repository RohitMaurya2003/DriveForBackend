const express=require('express')
const router=express.Router();
// const { upload } = require("../config/cloudinaryConfig");


const fileModel = require('../models/files.models'); // Import the file model

router.get('/home', async (req, res) => {
    try {
        const files = await fileModel.find(); // Fetch files from the database
        res.render('home', { files }); // Pass files to the view
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ message: "An error occurred while fetching files." });
    }
})


// router.post("/upload", (req, res) => {
//     res.json({ imageUrl: req.file.path });
// });



module.exports=router
