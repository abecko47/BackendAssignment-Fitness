/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('program_exercises', {
      programID: { type: Sequelize.BIGINT, primaryKey: true, allowNull: false, references: { model: 'programs', key: 'id' }, onDelete: 'CASCADE' },
      exerciseID: { type: Sequelize.BIGINT, primaryKey: true, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'CASCADE' },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('program_exercises');
  },
};
