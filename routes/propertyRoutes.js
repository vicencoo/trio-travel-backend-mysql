const express = require('express');
const router = express.Router();
const propertyControllers = require('../controllers/propertyControllers');
const { upload, processImages } = require('../middleware/multer');
const {
  propertyValidationRules,
  validate,
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.post(
  '/admin/add-property',
  upload.array('property_images'),
  processImages,
  protect(['admin']),
  propertyValidationRules(),
  validate,
  propertyControllers.addProperty,
);

router.get('/properties', propertyControllers.getProperties);

router.get('/property', propertyControllers.getProperty);

router.post(
  '/admin/renew-property',
  protect(['admin']),
  propertyControllers.renewProperty,
);

router.post(
  '/admin/property/publishOrDraft',
  protect(['admin']),
  propertyControllers.publishOrDraft,
);

router.post(
  '/admin/edit-property',
  upload.array('property_images'),
  processImages,
  protect(['admin']),
  propertyValidationRules(),
  validate,
  propertyControllers.editProperty,
);

router.post(
  '/admin/delete-property',
  protect(['admin']),
  propertyControllers.deleteProperty,
);

module.exports = router;
