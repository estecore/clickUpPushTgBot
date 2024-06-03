import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

class UserClickUp extends Model {
  public id!: number;
  public telegramId!: string;
  public clickUpId!: string;
  clickUpEmail: string | undefined;
}

UserClickUp.init(
  {
    telegramId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clickUpId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserClickUp",
  }
);

sequelize.sync();

export { sequelize, UserClickUp };
