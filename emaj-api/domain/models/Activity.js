const { DataTypes } = require('sequelize');

const db = require('../../infra/database/db.js')

const Activity = db.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    action: {
        type: DataTypes.STRING(150),
        allowNull: false,
      }
    },{
    timestamps: true,
});

module.exports = Activity;