/* eslint-disable */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE FUNCTION update_exercise_search_vector() RETURNS trigger AS $$
      BEGIN
        NEW."searchVector" := to_tsvector('english', NEW.name);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER exercises_search_vector_trigger
      BEFORE INSERT OR UPDATE ON exercises
      FOR EACH ROW EXECUTE FUNCTION update_exercise_search_vector();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS exercises_search_vector_trigger ON exercises;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_exercise_search_vector();
    `);
  },
};
