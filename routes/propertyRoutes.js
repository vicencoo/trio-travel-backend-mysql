const express = require('express');
const router = express.Router();
const propertyControllers = require('../controllers/propertyControllers');
const upload = require('../middleware/multer');
const {
  propertyValidationRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-property',
  upload.array('property_images'),
  propertyValidationRules(),
  validate,
  propertyControllers.addProperty,
);

router.get('/properties', propertyControllers.getProperties);

router.get('/property', propertyControllers.getOneProperty);

router.post(
  '/admin/edit-property',
  upload.array('property_images'),
  propertyValidationRules(),
  validate,
  propertyControllers.editProperty,
);

router.post('/admin/delete-property', propertyControllers.deleteProperty);

module.exports = router;
