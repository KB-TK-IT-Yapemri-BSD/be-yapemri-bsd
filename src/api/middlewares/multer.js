// middleware/multer.js
const multer = require('multer');

// Define storage configuration
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        // Generate a unique filename (if needed)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

// Create the Multer middleware
const upload = multer({ storage });

module.exports = upload;
