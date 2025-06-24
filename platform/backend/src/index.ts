import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from './config/config'
import authRoutes from "./routes/authentication";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000");
  await sequelize.sync();
});
