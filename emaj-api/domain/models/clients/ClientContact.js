const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const ClientContact = db.define('ClientContact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    phoneTwo: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
},{
    timestamps: true,
});

module.exports = ClientContact;