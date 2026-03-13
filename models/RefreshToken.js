const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    expires_at: { type: Sequelize.DATE, allowNull: false },
  },
  {
    tableName: 'refresh_tokens',
    underscored: true,
    timestamps: true,
  },
);

module.exports = RefreshToken;
