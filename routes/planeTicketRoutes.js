const express = require('express');
const router = express.Router();
const planeTicketController = require('../controllers/planeTicketController');
const { upload, processImages } = require('../middleware/multer');
const {
  planeTicketValidationRules,
  validate,
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.post(
  '/admin/add-ticket',
  upload.array('ticket_images', 1),
  processImages,
  protect(['admin']),
  planeTicketValidationRules(),
  validate,
  planeTicketController.addPlaneTicket,
);

router.get('/tickets', planeTicketController.getTickets);

router.post(
  '/admin/edit-ticket',
  upload.array('ticket_images', 1),
  processImages,
  protect(['admin']),
  planeTicketValidationRules(),
  validate,
  planeTicketController.editTicket,
);

router.post(
  '/admin/delete-ticket',
  protect(['admin']),
  planeTicketController.deleteTicket,
);

module.exports = router;
