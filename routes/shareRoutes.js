const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");

router.get("/share/property/:slug", shareController.shareProperty);

router.get("/share/package/:slug", shareController.sharePackage);

module.exports = router;
