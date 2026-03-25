const express = require('express');
const router = express.Router();
const touristPackageController = require('../controllers/touristPackageController');
const { upload, processImages } = require('../middleware/multer');
const {
  packageValidationRules,
  validate,
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.post(
  '/admin/add-package',
  upload.array('package_images'),
  processImages,
  protect(['admin']),
  packageValidationRules(),
  validate,
  touristPackageController.addPackage,
);

router.get('/packages', touristPackageController.getPackages);

router.get('/package', touristPackageController.getPackage);

router.post(
  '/admin/renew-package',
  protect(['admin']),
  touristPackageController.renewPackage,
);

router.post(
  '/admin/package/publishOrDraftPackage',
  protect(['admin']),
  touristPackageController.publishOrDraftPackage,
);

router.post(
  '/admin/edit-package',
  upload.array('package_images'),
  processImages,
  protect(['admin']),
  packageValidationRules(),
  validate,
  touristPackageController.editPackage,
);

router.post(
  '/admin/delete-package',
  protect(['admin']),
  touristPackageController.deletePackage,
);

module.exports = router;
