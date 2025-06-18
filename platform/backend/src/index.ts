// server
import express, { Express, Request, response, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

// const databaseUrl = process.env.DATABASE_URL;
// if (!databaseUrl) {
//   throw new Error("DATABASE_URL environment variable is not defined");
// }

// const sequelize = new Sequelize(databaseUrl, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: console.log
// });
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // or ':memory:' for in-memory database
  logging: console.log,
});

// Interfaces para User

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: Date;
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
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    birthdate: {type: DataTypes.STRING,allowNull: false},
    agreedTermsOfService:{type:DataTypes.BOOLEAN,allowNull: false}
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);

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

// Relaciones
User.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId" });

// JWT Config
const JWT_SECRET_KEY = "your-very-secure-secret-key";
const JWT_ACCESS_EXPIRY = "15m";
const REFRESH_KEY_EXPIRY = "7d";

type AuthenticationResponse = {
  success: boolean;
  message: string;
  data?: {
    firstname: string;
    lastname: string;
    birthdate: string;
    email: string;
  };
  error?: {
    code: string;
    message: string;
  };
  tokens?: {
    accesstoken?: string;
    refreshtoken?: string;
  };
};

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, birthdate, username, password, agreedTermsOfService } = req.body;
    // todo: make the checks
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstname,
      lastname,
      birthdate,
      agreedTermsOfService,
      username,
      password: hashedPassword,
    });
    const response: AuthenticationResponse = {
      success: true,
      message: "User created successfully",
    };
    res.status(201).json(response);
  } catch (err: any) {
    const Response: AuthenticationResponse = {
      success: false,
      message: "there was an error",
      error: {
        code: "SIGNUPERROR",
        message: err.message,
      },
    };
    res.status(400).json(Response);
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const response: AuthenticationResponse = {
        success: false,
        message: "Invalid credentials",
      };
      res.status(401).json(response);
      return;
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_ACCESS_EXPIRY,
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: REFRESH_KEY_EXPIRY,
    });

    await Token.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

    const response: AuthenticationResponse = {
      success: true,
      message: "valid credentials",
      tokens: {
        accesstoken: accessToken,
        refreshtoken: refreshToken,
      },
    };
    res.json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      const response: AuthenticationResponse = {
        success: false,
        message: "token is required",
      };
      res.status(401).json({ error: "Token required" });
      return;
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET_KEY) as { id: number };
    const tokenExists = await Token.findOne({ where: { token: refreshToken } });
    if (!tokenExists) {
      const response: AuthenticationResponse = {
        success: false,
        message: "invalid token",
      };
      res.status(401).json(response);
      return;
    }

    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_ACCESS_EXPIRY,
    });
    const response: AuthenticationResponse = {
      success: true,
      message: "successful",
      tokens: {
        accesstoken: newAccessToken,
      },
    };
    res.json(response);
  } catch {
    const response: AuthenticationResponse = {
      success: false,
      message: "token refresh failed",
    };
    res.status(401).json(response);
  }
});

app.get("/private", async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const response: AuthenticationResponse = {
        success: false,
        message: "Token required",
        error: {
          code: "PRIVATETOKENREQUIRED",
          message: "Token is required",
        },
      };
      res.status(401).json(response);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as { id: number };
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      const response: AuthenticationResponse = {
        success: false,
        message: "User not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post(
  "/reset-password",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        const response: AuthenticationResponse = {
          success: false,
          message: "token is required",
        };
        res.status(401).json({ error: "Token required" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        const response: AuthenticationResponse = {
          success: false,
          message: "User not found",
        };
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { oldPassword, newPassword } = req.body;
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        const response: AuthenticationResponse = {
          success: false,
          message: "Wrong password",
        };
        res.status(401).json({ error: "Wrong password" });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      const response: AuthenticationResponse = {
        success: true,
        message: "password has been changed successfully",
      };
      res.json(response);
    } catch (err: any) {
      const response: AuthenticationResponse = {
        success: false,
        message: "there was a server error",
      };
      res.status(400).json(response);
    }
  }
);

app.post("/signout", async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      const response: AuthenticationResponse = {
        success: false,
        message: "Token is required",
      };
      res.status(400).json({ error: "Token required" });
    }

    const tokenDeleted = await Token.destroy({
      where: { token: refreshToken },
    });
    if (!tokenDeleted) {
      const response: AuthenticationResponse = {
        success: false,
        message: "Token not found",
      };
      res.status(404).json(response);
    }

    const response: AuthenticationResponse = {
      success: true,
      message: "Signed out successfully",
    };
    res.json(response);
  } catch (err: any) {
    const response: AuthenticationResponse = {
      success: false,
      message: "uncatch error occurred",
    };
    res.status(500).json(response);
  }
});
app.post(
  "/change-username",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        const response: AuthenticationResponse = {
          success: false,
          message: "token is required",
        };
        res.status(401).json(response);
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        const response: AuthenticationResponse = {
          success: false,
          message: "user not found",
        };
        res.status(404).json(response);
        return;
      }

      const { newUsername, password } = req.body;
      if (!(await bcrypt.compare(password, user.password))) {
        const response: AuthenticationResponse = {
          success: false,
          message: "Wrong password",
        };
        res.status(401).json(response);
        return;
      }

      const existingUser = await User.findOne({
        where: { username: newUsername },
      });
      if (existingUser && existingUser.id !== user.id) {
        const response: AuthenticationResponse = {
          success: false,
          message: "Username already taken",
        };
        res.status(400).json(response);
        return;
      }

      user.username = newUsername;
      await user.save();
      const response: AuthenticationResponse = {
        success: true,
        message: "username updated successfully",
      };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Delete Account Endpoint
app.post(
  "/delete-account",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        const response: AuthenticationResponse = {
          success: false,
          message: "Token is required",
        };
        res.status(401).json(response);
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        const response: AuthenticationResponse = {
          success: false,
          message: "User not found",
        };
        res.status(404).json(response);
        return;
      }

      const { password } = req.body;
      if (!(await bcrypt.compare(password, user.password))) {
          const response: AuthenticationResponse = {
          success: false,
          message: "wrong password",
        };
        res.status(401).json(response);
        return;
      }

      // First delete all tokens associated with the user
      await Token.destroy({ where: { userId: user.id } });

      // Then delete the user
      await user.destroy();

        const response: AuthenticationResponse = {
          success: true,
          message: "Account deleted successfully",
        };
      res.json({ message: "Account deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000");
  await sequelize.sync();
});
