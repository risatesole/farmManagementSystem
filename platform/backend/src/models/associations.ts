import User from "./UserModel";
import Token from "./TokenModel";

User.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId" });
