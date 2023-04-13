const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.USUARIOSQL,
    password: process.env.PASSSQL,
    database: process.env.DATABASESQL,
    host: process.env.HOSTSQL,
    port: process.env.PORT,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    timezone: "-03:00",
  },
  test: {
    username: process.env.USUARIOSQL,
    password: process.env.PASSSQL,
    database: process.env.DATABASESQL,
    host: process.env.HOSTSQL,
    port: process.env.PORT,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    timezone: "-03:00",
  },
  production: {
    username: process.env.USUARIOSQL,
    password: process.env.PASSSQL,
    database: process.env.DATABASESQL,
    host: process.env.HOSTSQL,
    port: process.env.PORT,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    timezone: "-03:00",
  },
};
