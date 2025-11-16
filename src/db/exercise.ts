import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
} from "sequelize";
import { ProgramModel } from "./program";

import { EXERCISE_DIFFICULTY } from "../utils/enums";

export interface ExerciseModel extends Model {
  id: number;
  difficulty: EXERCISE_DIFFICULTY;
  name: string;

  programs?: ProgramModel[];

  addPrograms: BelongsToManyAddAssociationsMixin<ProgramModel, number>;
  removePrograms: BelongsToManyRemoveAssociationsMixin<ProgramModel, number>;
}

export default (sequelize: Sequelize, modelName: string) => {
  const ExerciseModelCtor = sequelize.define<ExerciseModel>(
    modelName,
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      difficulty: {
        type: DataTypes.ENUM(...Object.values(EXERCISE_DIFFICULTY)),
      },
      name: {
        type: DataTypes.STRING(200),
      },
      searchVector: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      tableName: "exercises",
    },
  );

  ExerciseModelCtor.associate = (models) => {
    ExerciseModelCtor.belongsToMany(models.Program, {
      through: models.ProgramExercises,
      foreignKey: "exerciseID",
      otherKey: "programID",
    });
  };

  return ExerciseModelCtor;
};
