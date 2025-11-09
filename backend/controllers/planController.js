const Plan = require('../models/Plan');
const Kitchen = require('../models/Kitchen');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .populate('kitchenId', 'name image rating address')
      .sort({ price: 1 });

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get plans by kitchen
// @route   GET /api/plans/kitchen/:kitchenId
// @access  Public
exports.getPlansByKitchen = async (req, res) => {
  try {
    const plans = await Plan.find({
      kitchenId: req.params.kitchenId,
      isActive: true,
    }).populate('kitchenId', 'name image rating');

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

