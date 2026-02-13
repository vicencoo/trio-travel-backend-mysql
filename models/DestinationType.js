const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Destination = require('./Destination');

const DestinationType = sequelize.define(
  'DestinationType',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: { type: Sequelize.STRING },
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
    tableName: 'destination_types',
    underscored: true,
    timestamps: true,
  },
);

module.exports = DestinationType;
