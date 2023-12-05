const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const CientSocioeconomicInformation = db.define('CientSocioeconomicInformation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    familyIncome: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    profession: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    acquaintance: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
},{
    timestamps: true,
});

module.exports = CientSocioeconomicInformation;