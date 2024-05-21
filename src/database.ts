import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

class User extends Model {
  public id!: number;
  public telegramId!: string;
  public clickUpId!: string;
  clickUpEmail: string | undefined;
}

User.init(
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
    modelName: "User",
  }
);

sequelize.sync();

export { sequelize, User };
