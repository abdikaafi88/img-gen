const Image = require('../models/Image');
const axios = require('axios');

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const apiKey = process.env.PEXELS_API_KEY || process.env.AI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'Pexels API key not configured' });
    }

    const searchQuery = encodeURIComponent(prompt);
    const apiUrl = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.data.photos || response.data.photos.length === 0) {
      return res.status(404).json({ message: 'No images found for this search query' });
    }

    const imageUrl = response.data.photos[0].src.large;

    const image = await Image.create({
      userId: req.user._id,
      prompt,
      imageUrl
    });

    res.status(201).json({
      _id: image._id,
      prompt: image.prompt,
      imageUrl: image.imageUrl,
      createdAt: image.createdAt
    });
  } catch (error) {
    console.error('Image search error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid Pexels API key' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'API rate limit exceeded' });
    }
    
    res.status(500).json({ 
      message: error.response?.data?.error || 'Failed to search image' 
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-userId');

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateImage, getHistory, deleteImage };
