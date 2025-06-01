const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { uploadPdf } = require('../controller/pdfcontroller');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

// POST /api/pdf/upload
router.post('/upload', upload.single('pdf'), uploadPdf);

module.exports = router;
