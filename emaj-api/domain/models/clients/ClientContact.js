const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const ClientContact = db.define('ClientContact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    phone: {
        type: DataTypes.INT,
        allowNull: false,
    },
    phoneTwo: {
        type: DataTypes.INT,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
},{
    timestamps: true,
});

module.exports = UserActivity;