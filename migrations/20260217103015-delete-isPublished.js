'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('properties', 'isPublished');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'isPublished');
  },
};
