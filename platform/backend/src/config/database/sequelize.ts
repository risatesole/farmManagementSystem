import { Sequelize } from 'sequelize';

function sqlite3configuration() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
  });
}

function postgreconfiguration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }
  return new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: console.log,
  });
}

const sequelize =
  process.env.ENVIRONMENT === 'production'
    ? postgreconfiguration()
    : sqlite3configuration();

export default sequelize;
