const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db')

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                           //
//  Essa é a tabela intermediária, criada para termos a relação "many-to-many" entre Demandas e Representantes (Usuários)   //
//                                                                                                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DemandLawyer = db.define('DemandLawyer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    }
},{
  timestamps: true,
});

module.exports = DemandLawyer;