import { Sequelize, DataTypes, Model } from "sequelize";

export interface UserExerciseCompletionModel extends Model {
  id: number;
  userID: number;
  exerciseID: number;
  completedAt: Date;
  durationSeconds: number;
}

export default (sequelize: Sequelize, modelName: string) => {
  const UserExerciseCompletionModelCtor =
    sequelize.define<UserExerciseCompletionModel>(
      modelName,
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        userID: { type: DataTypes.BIGINT, allowNull: false },
        exerciseID: { type: DataTypes.BIGINT, allowNull: false },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        durationSeconds: { type: DataTypes.INTEGER, allowNull: false },
      },
      {
        paranoid: true,
        timestamps: true,
        tableName: "user_exercise_completions",
      },
    );

  UserExerciseCompletionModelCtor.associate = (models) => {
    UserExerciseCompletionModelCtor.belongsTo(models.User, {
      foreignKey: "userID",
    });
    UserExerciseCompletionModelCtor.belongsTo(models.Exercise, {
      foreignKey: "exerciseID",
    });
  };

  return UserExerciseCompletionModelCtor;
};
