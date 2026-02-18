'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename column
    await queryInterface.renameColumn(
      'properties', // table name
      'renewed_at', // old column
      'published_at', // new column
    );

    // 2. Add new column
    await queryInterface.addColumn('properties', 'isPublished', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback changes
    await queryInterface.removeColumn('properties', 'isPublished');

    await queryInterface.renameColumn('properties', 'published_at', 'old_name');
  },
};
