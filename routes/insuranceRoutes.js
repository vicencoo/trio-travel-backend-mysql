const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { protect } = require('../middleware/auth');
const {
  insuranceValidationRules,
  validate,
} = require('../middleware/validators');

router.post(
  '/admin/add-insurance',
  protect(['admin']),
  insuranceValidationRules(),
  validate,
  insuranceController.createInsurance,
);

router.get(
  '/admin/insurances',
  protect(['admin']),
  insuranceController.getInsurances,
);

router.get(
  '/admin/expiring-insurances',
  protect(['admin']),
  insuranceController.getExpiringInsurances,
);

router.post(
  '/admin/renew-insurance',
  protect(['admin']),
  insuranceController.renewInsurance,
);

router.post(
  '/admin/edit-insurance',
  protect(['admin']),
  insuranceValidationRules(),
  validate,
  insuranceController.editInsurance,
);

router.post(
  '/admin/delete-insurance',
  protect(['admin']),
  insuranceController.deleteInsurance,
);

module.exports = router;
