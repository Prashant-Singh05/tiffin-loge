const express = require('express');
const router = express.Router();
const { getPlans, getPlansByKitchen } = require('../controllers/planController');

router.get('/', getPlans);
router.get('/kitchen/:kitchenId', getPlansByKitchen);

module.exports = router;

