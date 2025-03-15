const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db');
connectToDB();
const cookieParser = require('cookie-parser');
const uploadRouter = require('./routes/upload.routes'); // Uncommented uploadRouter
const { upload, cloudinary } = require('./config/cloudinaryConfig');
const app = express();
const indexRouter = require('./routes/index.routes');

// Set up view engine
app.set('view engine', 'ejs');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (if needed)
app.use(express.static('public'));

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/', uploadRouter); // Uncommented uploadRouter

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});