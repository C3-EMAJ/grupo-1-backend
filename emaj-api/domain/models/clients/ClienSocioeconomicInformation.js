const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const CientSocioeconomicInformation = db.define('CientSocioeconomicInformation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    income: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    familyIncome: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
},{
    timestamps: true,
});

module.exports = CientSocioeconomicInformation;