const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define(
  'Package',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    destination: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: false },
    duration: { type: Sequelize.DOUBLE, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    accomodation: { type: Sequelize.STRING, allowNull: false },
    meal_included: { type: Sequelize.STRING, allowNull: false },

    publishedAt: {
      type: Sequelize.DATE,
      allowNull: true, // must be true
    },

    status: {
      type: Sequelize.ENUM('draft', 'active'),
      allowNull: false,
      defaultValue: 'draft',
    },
  },
  {
    tableName: 'packages',
    underscored: true,
    timestamps: true,
  },
);

module.exports = Package;
