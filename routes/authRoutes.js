const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  signupValidationRules,
  validate,
  loginValidationRules,
} = require('../middleware/validators');
const { authenticate } = require('../middleware/auth');

router.post(
  '/authenticate/login',
  loginValidationRules(),
  validate,
  authController.login,
);

router.post(
  '/authenticate/signup',
  signupValidationRules(),
  validate,
  authController.signup,
);

router.post('/refresh-access-token', authController.refreshToken);

router.get('/get-user', authenticate, authController.getCurrentUser);

router.post('/logout', authController.logout);

module.exports = router;
