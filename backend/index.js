const { Sequelize } = require('@sequelize/core');
const { MsSqlDialect } = require('@sequelize/mssql');

const express = require('express')
const port =3000;
const app = express();

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: 'localhost',
  port: 3000,
  database: process.env.DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.USERNAME
    },
  },
});

