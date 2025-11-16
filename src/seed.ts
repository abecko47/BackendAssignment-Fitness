import dotenv from "dotenv";
dotenv.config();

import { models, sequelize } from "./db/index";
import { EXERCISE_DIFFICULTY, USER_ROLE } from "./utils/enums";

const { Exercise, Program, User } = models;

const seedDB = async () => {
  const programs = await Program.bulkCreate(
    [{ name: "Program 1" }, { name: "Program 2" }, { name: "Program 3" }],
    { returning: true },
  );

  // Create exercises
  const exercises = await Exercise.bulkCreate(
    [
      { name: "Exercise 1", difficulty: EXERCISE_DIFFICULTY.EASY },
      { name: "Exercise 2", difficulty: EXERCISE_DIFFICULTY.EASY },
      { name: "Exercise 3", difficulty: EXERCISE_DIFFICULTY.MEDIUM },
      { name: "Exercise 4", difficulty: EXERCISE_DIFFICULTY.MEDIUM },
      { name: "Exercise 5", difficulty: EXERCISE_DIFFICULTY.HARD },
      { name: "Exercise 6", difficulty: EXERCISE_DIFFICULTY.HARD },
    ],
    { returning: true },
  );

  await programs[0].addExercises([exercises[0], exercises[2], exercises[4]]);
  await programs[1].addExercises([exercises[1], exercises[3], exercises[5]]);
  await programs[2].addExercises([]);

  // Create users
  await User.bulkCreate(
    [
      {
        name: "John",
        surname: "Admin",
        nickName: "johnadmin",
        email: "john.admin@example.com",
        age: 30,
        role: USER_ROLE.ADMIN,
        password: "password123",
      },
      {
        name: "John",
        surname: "User",
        nickName: "johnuser",
        email: "john.user@example.com",
        age: 25,
        role: USER_ROLE.USER,
        password: "password123",
      },
    ],
    { individualHooks: true }, // hash passwords
  );
};

seedDB()
  .then(() => {
    console.log("DB seed done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error in seed, check your data and model\n", err);
    process.exit(1);
  });
