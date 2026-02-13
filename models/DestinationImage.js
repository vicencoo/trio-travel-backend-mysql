const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Destination = require('./Destination');

const DestinationImage = sequelize.define(
  'DestinationImage',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    destination_image: { type: Sequelize.STRING },
    destination_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Destination,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'destination_images',
    underscored: true,
    timestamps: true,
  },
);

module.exports = DestinationImage;
