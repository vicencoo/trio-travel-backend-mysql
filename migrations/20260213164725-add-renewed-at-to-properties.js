'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add column as nullable first
    await queryInterface.addColumn('properties', 'renewed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Step 2: Fill existing rows with their created_at value
    await queryInterface.sequelize.query(
      'UPDATE properties SET renewed_at = created_at',
    );

    // Step 3: Now make it NOT NULL
    await queryInterface.changeColumn('properties', 'renewed_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('properties', 'renewed_at');
  },
};
