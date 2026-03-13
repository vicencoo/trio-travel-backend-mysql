const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Insurance = sequelize.define(
  'Insurance',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    client_name: { type: Sequelize.TEXT, allowNull: false },
    contact_number: { type: Sequelize.STRING(20), allowNull: false },
    car_plate: { type: Sequelize.TEXT, allowNull: false },
    expiration_date: { type: Sequelize.DATEONLY, allowNull: false },
  },
  {
    tableName: 'insurances',
    underscored: true,
    timestamps: true,
  },
);

module.exports = Insurance;
