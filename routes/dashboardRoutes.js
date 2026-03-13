const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get(
  '/admin/dashboard',
  protect(['admin']),
  dashboardController.getDataCounts,
);

router.get(
  '/admin/analytics',
  protect(['admin']),
  dashboardController.analytics,
);

module.exports = router;
