const express = require("express");
const router = express.Router();
const flightCompaniesControllers = require("../controllers/flightCompaniesControllers");
const { protect } = require("../middleware/auth");

router.post(
  "/admin/add-flight-company",
  protect(["admin"]),
  flightCompaniesControllers.addCompany,
);

router.get(
  "/admin/get-all-flight-companies",
  protect(["admin"]),
  flightCompaniesControllers.getFlightCompanies,
);

router.post(
  "/admin/edit-flight-company",
  protect(["admin"]),
  flightCompaniesControllers.editCompany,
);

router.post(
  "/admin/delete-company",
  protect(["admin"]),
  flightCompaniesControllers.deleteCompany,
);

module.exports = router;
