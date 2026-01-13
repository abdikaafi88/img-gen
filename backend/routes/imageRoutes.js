const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateImage, getHistory, deleteImage } = require('../controllers/imageController');

router.post('/generate', protect, generateImage);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteImage);

module.exports = router;
