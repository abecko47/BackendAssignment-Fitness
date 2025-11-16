/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_exercise_completions', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      userID: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      exerciseID: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'CASCADE' },
      completedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      durationSeconds: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_exercise_completions');
  },
};
