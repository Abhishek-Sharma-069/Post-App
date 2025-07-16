// =====================================
// Upload Middleware - Handles file uploads using multer
// =====================================

const multer = require('multer');
const path = require('path');

// Set up storage configuration for uploaded files
const storage = multer.diskStorage({
  // Set destination folder for uploads
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'));
  },
  // Set filename for uploaded files (timestamp-originalname)
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer instance with the storage config
const upload = multer({ storage });

// Export the upload middleware to use in routes
module.exports = upload;
