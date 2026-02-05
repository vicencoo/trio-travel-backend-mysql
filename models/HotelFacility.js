const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Hotel = require('./Hotel');

const HotelFacility = sequelize.define(
  'HotelFacility',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    facility: { type: Sequelize.STRING },
    hotel_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Hotel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'hotel_facilities',
    underscored: true,
    timestamps: true,
  },
);

module.exports = HotelFacility;
