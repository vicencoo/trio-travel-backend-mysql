const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Package = require('./TouristPackage');

const PackageImage = sequelize.define(
  'PackageImage',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    package_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Package,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'package_images',
    underscored: true,
    timestamps: true,
  },
);

module.exports = PackageImage;
