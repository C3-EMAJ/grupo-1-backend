const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db.js');

const ClientDocument = db.define('ClientDocument', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  name: {
      type: DataTypes.STRING(100),
      allowNull: true,
  },
  size: {
      type: DataTypes.FLOAT,
      allowNull: true,
  },
  key: {
      type: DataTypes.STRING(500),
      allowNull: true,
  },
  url: {
      type: DataTypes.STRING(500),
      allowNull: true,
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
},{
    timestamps: true,
});

module.exports = ClientDocument;