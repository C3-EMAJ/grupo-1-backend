const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db.js');
const UserActivity = require('./UserActivity.js');
const UserImage = require('./UserImage.js');

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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },

    },{
    timestamps: true,
});

// Relacionando o usuário com as suas atividades:
UserActivity.belongsTo(User, { constraint: true, foreignKey: 'idActivity' });
User.hasMany(UserActivity, { foreignKey: 'idUser', onDelete: 'CASCADE', hooks: true  });
//

// Relacionando o usuário com a sua imagem:
UserImage.belongsTo(User, { constraint: true, foreignKey: 'idImage' });
User.hasOne(UserImage, { foreignKey: 'idUser', onDelete: 'CASCADE', hooks: true  });
//

module.exports = User;