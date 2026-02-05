const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Hotel = require('./Hotel');

const HotelImage = sequelize.define(
  'HotelImage',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    hotel_image: { type: Sequelize.STRING },
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
    tableName: 'hotel_images',
    underscored: true,
    timestamps: true,
  },
);

module.exports = HotelImage;
