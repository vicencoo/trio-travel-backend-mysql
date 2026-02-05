const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('./Property');

const PropertyImage = sequelize.define(
  'PropertyImage',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    property_image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Property,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'property_images',
    underscored: true,
    timestamps: true,
  },
);

module.exports = PropertyImage;
