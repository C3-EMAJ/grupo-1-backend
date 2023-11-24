const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const ClientDependents = db.define('ClientDependents', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    age: {
        type: DataTypes.INT,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.INT,
        allowNull: true,
    },

},{
    timestamps: true,
});

module.exports = UserActivity;