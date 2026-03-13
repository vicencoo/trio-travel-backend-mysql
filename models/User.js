const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    username: { type: Sequelize.STRING, allowNull: false },
    role: {
      type: Sequelize.ENUM('admin', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  },
);

module.exports = User;
