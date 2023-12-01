const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db.js');
const Client = require('../clients/Cient.js');
const DemandClient = require('./DemandClient.js');
const DemandDocument = require('./DemandDocument.js');
const User = require('../user/User.js');
const DemandLawyer = require('./DemandLawyer.js');

const Demand = db.define('Demands', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    office: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    summary: {
        type: DataTypes.STRING(300),
        allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },

    },{
    timestamps: true,
});

// Relacionando a demanda com os seus clientes (ou só um cliente):
Demand.belongsToMany(Client, { through: { model: DemandClient }, foreignKey: 'idClient', constraint: true });
Client.belongsToMany(Demand, { through: { model: DemandClient }, foreignKey: 'idDemand', constraint: true });
//

// Relacionando a demanda com os seus representantes (ou só um representante):
Demand.belongsToMany(User, { through: { model: DemandLawyer }, foreignKey: 'idUser', constraint: true });
User.belongsToMany(Demand, { through: { model: DemandLawyer }, foreignKey: 'idDemand', constraint: true });
//

// Relacionando a demanda com os seus documentos:
DemandDocument.belongsTo(Demand, { constraint: true, foreignKey: 'idDocument' });
Demand.hasMany(DemandDocument, { foreignKey: 'idDemand', onDelete: 'CASCADE', hooks: true  });
//

module.exports = Demand;