'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const PlaneTicket = sequelize.define(
  'PlaneTicket',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    from: { type: Sequelize.STRING, allowNull: false },
    to: { type: Sequelize.STRING, allowNull: false },
    departure_airport: { type: Sequelize.STRING, allowNull: false },
    arrival_airport: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: false },
  },
  {
    tableName: 'tickets',
    underscored: true,
    timestamps: true,
  },
);

module.exports = PlaneTicket;
