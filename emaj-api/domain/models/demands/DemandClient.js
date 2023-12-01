const { DataTypes } = require('sequelize');

const db = require('../../db')

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                      //
//  Essa é a tabela intermediária, criada para termos a relação "many-to-many" entre Demandas e Assistidos (Clients)   //
//                                                                                                                    //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DemandClient = db.define('DemandClient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    }
},{
  timestamps: true,
});

module.exports = DemandClient;