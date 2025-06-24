import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Token from "./TokenModel";

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
  email: string;
  username: string;
  password: string;
  agreedTermsOfService:boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public birthdate!: Date;
  public agreedTermsOfService!:boolean;

  // timestamps si usas
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: {type: DataTypes.STRING, allowNull: false},
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    birthdate: {type: DataTypes.STRING,allowNull: false},
    agreedTermsOfService:{type:DataTypes.BOOLEAN,allowNull: false}
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
  }
);

export default User