require('dotenv').config({path:'../../../.env'});
const Sequelize = require('sequelize');

const config = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const connection = new Sequelize(config);

module.exports = connection;