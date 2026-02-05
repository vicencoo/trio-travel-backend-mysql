const express = require('express');
const router = express.Router();
const touristPackageController = require('../controllers/touristPackageController');
const upload = require('../middleware/multer');
const {
  packageValidationRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-package',
  upload.array('package_images'),
  packageValidationRules(),
  validate,
  touristPackageController.addPackage,
);

router.get('/packages', touristPackageController.getPackages);

router.get('/package', touristPackageController.getPackage);

router.post(
  '/admin/edit-package',
  upload.array('package_images'),
  packageValidationRules(),
  validate,
  touristPackageController.editPackage,
);

router.post('/admin/delete-package', touristPackageController.deletePackage);

module.exports = router;
