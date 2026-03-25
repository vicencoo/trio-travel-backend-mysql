'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'availability', {
      type: Sequelize.ENUM('available', 'sold', 'rented'),
      allowNull: false,
      defaultValue: 'available',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('properties', 'availability');
  },
};
