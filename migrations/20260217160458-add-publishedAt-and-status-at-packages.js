'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('packages', 'publishedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('packages', 'status', {
      type: Sequelize.ENUM('draft', 'active'),
      allowNull: false,
      defaultValue: 'draft',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('packages', 'status');
    await queryInterface.removeColumn('packages', 'publishedAt');
  },
};
