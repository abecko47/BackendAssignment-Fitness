import { Sequelize, DataTypes, Model } from 'sequelize'
import bcrypt from 'bcrypt'
import { USER_ROLE } from '../utils/enums'

export class UserModel extends Model {
  declare id: number
  declare name: string
  declare surname: string
  declare nickName: string
  declare email: string
  declare age: number
  declare role: USER_ROLE
  declare password: string

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}

export default (sequelize: Sequelize, modelName: string) => {
  return UserModel.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(200), allowNull: false },
      surname: { type: DataTypes.STRING(200), allowNull: false },
      nickName: { type: DataTypes.STRING(200), allowNull: false },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      age: { type: DataTypes.INTEGER, allowNull: false },
      role: {
        type: DataTypes.ENUM(...Object.values(USER_ROLE)),
        allowNull: false,
        defaultValue: USER_ROLE.USER,
      },
      password: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      sequelize,
      modelName,
      tableName: 'users',
      paranoid: true,
      timestamps: true,
      hooks: {
        beforeCreate: async (user: UserModel) => {
          user.password = await bcrypt.hash(user.password, 10)
        },
        beforeUpdate: async (user: UserModel) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10)
          }
        },
      },
    }
  )
}
