const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const destinationController = require('../controllers/destinationControllers');
const {
  destinationValidateRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-destination',
  upload.array('destination_images'),
  destinationValidateRules(),
  validate,
  destinationController.addDestination,
);

router.get('/destinations', destinationController.getDestinations);

router.post(
  '/admin/edit-destination',
  upload.array('destination_images'),
  destinationValidateRules(),
  validate,
  destinationController.editDestination,
);

router.post(
  '/admin/delete-destination',
  destinationController.deleteDestination,
);

module.exports = router;
