const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('kitchenId', 'name image');

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('kitchenId', 'name image address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user owns the order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    // Generate unique order ID
    const orderId = `DH${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Calculate totals
    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const tax = totalAmount * 0.05; // 5% tax
    const deliveryFee = 30; // Fixed delivery fee
    const discount = 0; // Can be calculated from coupon
    const finalAmount = totalAmount + tax + deliveryFee - discount;

    // Get kitchen info from first item
    const kitchenId = items[0]?.kitchenId;
    const kitchenName = items[0]?.kitchenName || 'Unknown Kitchen';

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      kitchenId,
      kitchenName,
      items,
      orderId,
      totalAmount,
      tax,
      deliveryFee,
      discount,
      finalAmount,
      deliveryAddress: deliveryAddress || req.user.address,
      paymentMethod: paymentMethod || 'razorpay',
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], couponCode: '', discount: 0 }
    );

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

