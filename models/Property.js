const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define(
  'Property',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    property_type: { type: Sequelize.STRING, allowNull: false },
    listing_type: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    city: Sequelize.STRING,
    street: Sequelize.STRING,
    area: Sequelize.STRING,
    price: { type: Sequelize.DOUBLE, allowNull: false },
    space: { type: Sequelize.DOUBLE, allowNull: false },
    bedrooms: { type: Sequelize.DOUBLE, allowNull: true },
    toilets: { type: Sequelize.DOUBLE, allowNull: true },
    floor_number: { type: Sequelize.DOUBLE, allowNull: true },
    build_year: { type: Sequelize.DOUBLE, allowNull: true },

    // publishedAt: {
    //   type: Sequelize.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.NOW,
    // },
    publishedAt: {
      type: Sequelize.DATE,
      allowNull: true, // must be true
    },

    status: {
      type: Sequelize.ENUM('draft', 'active'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    tableName: 'properties',
    underscored: true,
    timestamps: true,
  },
);

module.exports = Property;
