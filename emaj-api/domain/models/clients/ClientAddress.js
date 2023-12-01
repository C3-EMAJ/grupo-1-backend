const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const ClientAddress = db.define('ClientAddress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    cep: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    complement: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
},{
    timestamps: true,
});

module.exports = ClientAddress;