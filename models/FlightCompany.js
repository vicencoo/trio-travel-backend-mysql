const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const FlightCompany = sequelize.define(
  "FlightCompany",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    flight_company: { type: Sequelize.TEXT, allowNull: false },
  },
  {
    tableName: "flight_companies",
    underscored: true,
    timestamps: true,
  },
);

module.exports = FlightCompany;
