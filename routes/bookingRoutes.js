const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingControllers');
const { protect } = require('../middleware/auth');
const {
  bookingValidationRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-booking',
  protect(['admin']),
  bookingValidationRules(),
  validate,
  bookingController.addBooking,
);

router.get(
  '/admin/get-bookings',
  protect(['admin']),
  bookingController.getBookings,
);

router.get(
  '/admin/get-checkin-tickets',
  protect(['admin']),
  bookingController.getCheckinTickets,
);

router.post(
  '/admin/bookings/toggle-status',
  protect(['admin']),
  bookingController.bookingToggleStatus,
);

router.post(
  '/admin/edit-booking',
  protect(['admin']),
  bookingValidationRules(),
  validate,
  bookingController.editBooking,
);

router.post(
  '/admin/delete-booking',
  protect(['admin']),
  bookingController.deleteBooking,
);

module.exports = router;
