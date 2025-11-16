/* eslint-disable */
require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_CONNECTION_URL,
    dialect: "postgres",
    logging: console.log,
  },
  test: {
    url: process.env.DB_CONNECTION_URL,
    dialect: "postgres",
    logging: false,
  },
  production: {
    url: process.env.DB_CONNECTION_URL,
    dialect: "postgres",
    logging: false,
  },
};
