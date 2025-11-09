const express = require('express');
const router = express.Router();
const Kitchen = require('../models/Kitchen');

// @desc    Get all kitchens
// @route   GET /api/kitchens
// @access  Public
router.get('/', async (req, res) => {
  try {
    const kitchens = await Kitchen.find({ isActive: true }).sort({ rating: -1 });
    res.status(200).json({
      success: true,
      kitchens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get kitchen by ID
// @route   GET /api/kitchens/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id);
    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen not found',
      });
    }
    res.status(200).json({
      success: true,
      kitchen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

