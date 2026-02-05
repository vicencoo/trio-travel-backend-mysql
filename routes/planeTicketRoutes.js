const express = require('express');
const router = express.Router();
const planeTicketController = require('../controllers/planeTicketController');
const upload = require('../middleware/multer');
const {
  planeTicketValidationRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-ticket',
  upload.array('ticket_images', 1),
  planeTicketValidationRules(),
  validate,
  planeTicketController.addPlaneTicket,
);

router.get('/tickets', planeTicketController.getTickets);

router.post(
  '/admin/edit-ticket',
  upload.array('ticket_images', 1),
  planeTicketValidationRules(),
  validate,
  planeTicketController.editTicket,
);

router.post('/admin/delete-ticket', planeTicketController.deleteTicket);

module.exports = router;
