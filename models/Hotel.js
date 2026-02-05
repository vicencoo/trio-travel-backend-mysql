const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Hotel = sequelize.define(
  'Hotel',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    hotel_name: { type: Sequelize.STRING, allowNull: false },
    location: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    rating: { type: Sequelize.DOUBLE, allowNull: false },
    reviews: { type: Sequelize.DOUBLE, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: false },
  },
  {
    tableName: 'hotels',
    underscored: true,
    timestamps: true,
  },
);

module.exports = Hotel;
