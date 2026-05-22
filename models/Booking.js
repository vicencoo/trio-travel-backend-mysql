const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const FlightCompany = require("./FlightCompany");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    client_name: { type: Sequelize.STRING, allowNull: false },
    ticket_code: { type: Sequelize.STRING, allowNull: false },
    ticket_date: { type: Sequelize.DATE, allowNull: false },
    ticket_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    flight_company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: FlightCompany,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: Sequelize.ENUM("pending", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "bookings",
    underscored: true,
    timestamps: true,
  },
);

module.exports = Booking;
