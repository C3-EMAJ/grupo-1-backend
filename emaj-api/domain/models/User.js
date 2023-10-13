const { DataTypes } = require('sequelize');

const db = require('../../infra/database/db.js')

const User = db.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
    password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    img: {
        type: DataTypes.STRING(700),
        allowNull: true,
        defaultValue: null
    },
    
    },{
    timestamps: true,
});
  
module.exports = User;