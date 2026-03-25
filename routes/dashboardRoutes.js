const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get(
  '/admin/dashboard/get-data-counts',
  protect(['admin']),
  dashboardController.getDataCounts,
);

router.get(
  '/admin/dashboard/get-analytics',
  protect(['admin']),
  dashboardController.analytics,
);

module.exports = router;
