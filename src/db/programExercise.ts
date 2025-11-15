import { Sequelize, DataTypes, Model } from "sequelize";

export interface ProgramExerciseModel extends Model {
  programID: number;
  exerciseID: number;
}

export default (sequelize: Sequelize, modelName: string) => {
  return sequelize.define<ProgramExerciseModel>(
    modelName,
    {
      programID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      exerciseID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "program_exercises",
      timestamps: false,
    },
  );
};
