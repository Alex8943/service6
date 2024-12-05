'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn("reviews", "media_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
      });
      await queryInterface.changeColumn("reviews", "platform_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
      });
      await queryInterface.changeColumn("reviews", "user_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn("reviews", "media_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
      });
      await queryInterface.changeColumn("reviews", "platform_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
      });
      await queryInterface.changeColumn("reviews", "user_fk", {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
      });
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
