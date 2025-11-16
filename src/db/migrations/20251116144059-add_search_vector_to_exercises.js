/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exercises', 'searchVector', {
      type: 'TSVECTOR',
    });

    await queryInterface.sequelize.query(`
      CREATE INDEX exercises_search_idx ON exercises USING GIN ("searchVector");
    `);

    await queryInterface.sequelize.query(`
      UPDATE exercises SET "searchVector" = to_tsvector('english', name);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('exercises', 'searchVector');
  }
};
