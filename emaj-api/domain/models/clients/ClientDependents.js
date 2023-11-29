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
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    timestamps: true,
});

module.exports = ClientDependents;