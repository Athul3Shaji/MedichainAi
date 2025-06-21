const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the subfolder based on the route
        let uploadPath = 'uploads/';
        if (req.originalUrl.includes('/claims')) {
            uploadPath = 'uploads/claims/';
        } else if (req.originalUrl.includes('/users')) {
            uploadPath = 'uploads/profiles/';
        }
        cb(null, uploadPath);  // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow images and PDFs for claims
    if (req.originalUrl.includes('/claims')) {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Please upload only images or PDF files.'), false);
        }
    } else {
        // For other routes (like user profile), only allow images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
};

// Export the multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload; 