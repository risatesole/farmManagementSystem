const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../../database.sqlite",
  logging: false, // true para ver logs de consultas
});

export default sequelize;
