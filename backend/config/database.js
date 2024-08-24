require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USUARIO,
    password: process.env.PASSWORD,
    host: 'localhost',
    dialect: 'mssql',
    port: 1433,
    dialectOptions: {
        encrypt: true,
        trustServerCertificate: true, // Permite certificados auto-firmados
    }
});

module.exports = sequelize;