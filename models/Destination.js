const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Destination = sequelize.define(
  'Destination',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    city: { type: Sequelize.STRING, allowNull: false },
    country: { type: Sequelize.STRING, allowNull: false },
    slogan: { type: Sequelize.STRING, allowNull: false },
  },
  {
    tableName: 'destinations',
    underscored: true,
    timestamps: true,
  },
);

module.exports = Destination;
