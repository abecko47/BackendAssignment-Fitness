/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exercises', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      difficulty: { type: Sequelize.ENUM('EASY', 'MEDIUM', 'HARD'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });

    // Add searchVector column
    await queryInterface.addColumn('exercises', 'searchVector', {
      type: 'TSVECTOR',
    });

    // Create GIN index
    await queryInterface.sequelize.query(`
      CREATE INDEX exercises_search_idx ON exercises USING GIN ("searchVector");
    `);

    // Update existing rows
    await queryInterface.sequelize.query(`
      UPDATE exercises SET "searchVector" = to_tsvector('english', name);
    `);

    // Create trigger function
    await queryInterface.sequelize.query(`
      CREATE FUNCTION update_exercise_search_vector() RETURNS trigger AS $$
      BEGIN
        NEW."searchVector" := to_tsvector('english', NEW.name);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER exercises_search_vector_trigger
      BEFORE INSERT OR UPDATE ON exercises
      FOR EACH ROW EXECUTE FUNCTION update_exercise_search_vector();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS exercises_search_vector_trigger ON exercises;
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_exercise_search_vector();
    `);
    await queryInterface.removeColumn('exercises', 'searchVector');
    await queryInterface.dropTable('exercises');
  },
};
