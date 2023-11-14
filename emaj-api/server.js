require('dotenv').config({path:'.env'});
const express = require('express');
const cors = require('cors');

const db = require('./infra/database/db.js');

// Importando as rotas que serão usadas (endpoints) //
const AuthRoute = require("./domain/routes/Authentication.js");
const UsersRoute = require("./domain/routes/Users.js");
const ActivityRoute = require("./domain/routes/ActivityLog.js");
//

// Instanciando o Express:
const server = express();

// Middleware usado:
server.use(cors());

// Possibilitando o uso de json:
server.use(express.json());


// Fazendo o server usar as rotas importadas: //
server.use("/emaj-api/auth", AuthRoute);
server.use("/emaj-api/users", UsersRoute);  
server.use("/emaj-api/activity", ActivityRoute);
//

//{force:true}
db.sync().then(() => {
    server.listen(process.env.PORT)
    console.log(`Server running at: http://localhost:${process.env.PORT}`);
}).catch(err => console.log(err))