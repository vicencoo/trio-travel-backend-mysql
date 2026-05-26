const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");

router.get("/share/property/:slug", shareController.shareProperty);

module.exports = router;
