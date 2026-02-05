const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const PlaneTicket = require('./PlaneTicket');

const PlaneTicketImage = sequelize.define(
  'PlaneTicketImage',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    image: { type: Sequelize.STRING, allowNull: false },
    ticket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: PlaneTicket,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'ticket_images',
    underscored: true,
    timestamps: true,
  },
);

module.exports = PlaneTicketImage;
