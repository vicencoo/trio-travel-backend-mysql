/** @type {import('sequelize').ModelStatic<any>} */
const FlightCompany = require("../models/FlightCompany");

exports.addCompany = async (req, res) => {
  try {
    const { name } = req.body;

    const companyName = name?.trim().toLowerCase();

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }

    await FlightCompany.create({
      flight_company: companyName,
    });

    res.json({ message: "Company created!" });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Error while creating new flight company." });
  }
};

exports.getFlightCompanies = async (req, res) => {
  try {
    const companies = await FlightCompany.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(companies);
  } catch (err) {
    console.error("Cannot get companies", err);
    res.status(400).json({ message: "Cannot get all companies!" });
  }
};

exports.editCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { name } = req.body;

    const companyName = name?.trim().toLowerCase();

    if (!companyId || !companyName) {
      return res
        .status(400)
        .json({ message: "Company id and name are required" });
    }

    const [updated] = await FlightCompany.update(
      { flight_company: companyName },
      { where: { id: companyId } },
    );

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company updated!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cannot edit company!" });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "Company id is required" });
    }

    const deleted = await FlightCompany.destroy({ where: { id: companyId } });

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Flight company deleted!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting the flight company" });
  }
};
