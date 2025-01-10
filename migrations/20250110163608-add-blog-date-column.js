'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Blogs", "startDate", {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn("Blogs", "endDate", {
      type: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Blogs", "startDate");
    await queryInterface.removeColumn("Blogs", "endDate");
  }
};
