import fs from "fs";
import { Sequelize } from "sequelize";

import defineExercise from "./exercise";
import defineProgram from "./program";
import defineUser from "./user";
import defineProgramExercise from "./programExercise";
import defineUserExerciseCompletion from "./userExerciseCompletion";

const sequelize: Sequelize = new Sequelize(process.env.DB_CONNECTION_URL, {
  logging: false,
});

sequelize
  .authenticate()
  .catch((e: any) => console.error(`Unable to connect to the database${e}.`));

const Exercise = defineExercise(sequelize, "exercise");
const Program = defineProgram(sequelize, "program");
const User = defineUser(sequelize, "user");
const ProgramExercises = defineProgramExercise(sequelize, "programExercises");
const UserExerciseCompletion = defineUserExerciseCompletion(
  sequelize,
  "userExerciseCompletions",
);

const models = {
  Exercise,
  Program,
  User,
  ProgramExercises,
  UserExerciseCompletion,
};
type Models = typeof models;

Object.values(models).forEach((value: any) => {
  if (value.associate) {
    value.associate(models);
  }
});

export { models, sequelize };
export type { Models };
