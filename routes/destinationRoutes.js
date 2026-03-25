const express = require('express');
const router = express.Router();
const { upload, processImages } = require('../middleware/multer');
const destinationController = require('../controllers/destinationController');
const {
  destinationValidateRules,
  validate,
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.post(
  '/admin/add-destination',
  upload.array('destination_images'),
  processImages,
  protect(['admin']),
  destinationValidateRules(),
  validate,
  destinationController.addDestination,
);

router.get('/destinations', destinationController.getDestinations);

router.post(
  '/admin/edit-destination',
  upload.array('destination_images'),
  processImages,
  protect(['admin']),
  destinationValidateRules(),
  validate,
  destinationController.editDestination,
);

router.post(
  '/admin/delete-destination',
  protect(['admin']),
  destinationController.deleteDestination,
);

module.exports = router;
