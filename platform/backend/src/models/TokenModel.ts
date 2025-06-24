import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import User from "./UserModel";

// Interfaces para Token
interface TokenAttributes {
  id: number;
  token: string;
  expiresAt: Date;
  userId: number;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, "id"> {}

class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  public id!: number;
  public token!: string;
  public expiresAt!: Date;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Token",
    tableName: "Tokens",
  }
);

export default Token