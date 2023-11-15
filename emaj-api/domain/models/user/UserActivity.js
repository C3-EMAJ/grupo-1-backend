const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

const UserActivity = db.define('UserActivity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
},{
    timestamps: true,
});

module.exports = UserActivity;