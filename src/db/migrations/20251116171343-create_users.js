/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      surname: { type: Sequelize.STRING(200), allowNull: false },
      nickName: { type: Sequelize.STRING(200), allowNull: false },
      email: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      age: { type: Sequelize.INTEGER, allowNull: false },
      role: { type: Sequelize.ENUM('USER', 'ADMIN'), allowNull: false, defaultValue: 'USER' },
      password: { type: Sequelize.STRING(255), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
