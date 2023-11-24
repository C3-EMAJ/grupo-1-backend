const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db.js');

const ClientSocioeconomicInformation = require("./ClienSocioeconomicInformation.js")
const ClientAddress = require("./ClientAddress.js")
const ClientContact = require("./ClientContact.js")
const ClientDependents = require("./ClientDependents.js")

const Client = db.define('Clients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    rg: {
        type: DataTypes.INT(20),
        allowNull: false,
        unique: true,
    },
    cpf: {
      type: DataTypes.INT(15),
      allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    age: {
      type: DataTypes.INT(3),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    },{
    timestamps: true,
});

// Relacionando o cliente com as suas informações socioeconomicas:
ClientSocioeconomicInformation.belongsTo(Client, { constraint: true, foreignKey: 'idSocioeconomicInfo' });
Client.hasOne(ClientSocioeconomicInformation, { foreignKey: 'idClient', onDelete: 'CASCADE', hooks: true  });
//

// Relacionando o cliente com seu endereço:
ClientAddress.belongsTo(Client, { constraint: true, foreignKey: 'idAddress' });
Client.hasOne(ClientAddress, { foreignKey: 'idClient', onDelete: 'CASCADE', hooks: true  });
//

// Relacionando o cliente com suas informações de contato:
ClientContact.belongsTo(Client, { constraint: true, foreignKey: 'idContact' });
Client.hasOne(ClientContact, { foreignKey: 'idClient', onDelete: 'CASCADE', hooks: true  });
//

// Relacionando o cliente com seus dependentes:
ClientDependents.belongsTo(Client, { constraint: true, foreignKey: 'idDependents' });
Client.hasOne(ClientDependents, { foreignKey: 'idClient', onDelete: 'CASCADE', hooks: true  });
//

module.exports = Client;