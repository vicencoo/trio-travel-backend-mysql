const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const upload = require('../middleware/multer');
const { hotelValidationRules, validate } = require('../middleware/validators');

router.post(
  '/admin/add-hotel',
  upload.array('hotel_images'),
  hotelValidationRules(),
  validate,
  hotelController.addHotel,
);

router.get('/hotels', hotelController.getHotels);

router.get('/hotel', hotelController.getOneHotel);

router.post(
  '/admin/edit-hotel',
  upload.array('hotel_images'),
  hotelValidationRules(),
  validate,
  hotelController.editHotel,
);

router.post('/admin/delete-hotel', hotelController.deleteHotel);

module.exports = router;
