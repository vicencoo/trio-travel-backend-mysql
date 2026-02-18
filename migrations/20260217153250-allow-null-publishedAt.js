'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('properties', 'published_at', {
      type: Sequelize.DATE,
      allowNull: true, // 🔥 change here
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('properties', 'published_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
