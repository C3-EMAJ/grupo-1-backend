require('dotenv').config({path:'.env'});
const express = require('express');
const cors = require('cors');
const path = require("path");

const cron = require('node-cron');
const db = require('./infra/database/db.js');

// Importando as rotas que serão usadas (endpoints) //
const AuthRoute = require("./domain/routes/Authentication.js");
const EmailRoute = require("./domain/routes/Email.js")
const UsersRoute = require("./domain/routes/Users.js");
const ActivityRoute = require("./domain/routes/ActivityLog.js");
const UploadRoute = require("./domain/routes/Upload.js")
const DemandsRoute = require("./domain/routes/Demands.js")
//

// Instanciando o Express:
const server = express();

// Middleware usado:
server.use(cors());

// Possibilitando o uso de json:
server.use(express.json());

// Arrumando o user que recebemos no header:
server.use((req, res, next) => {
    if (req.headers.user) {
        req.user = JSON.parse(req.headers.user); 
    }
    next();
});
//

// Adicionando um "ping" no servidor que acontece a cada 10 minutos para o servidor que está no Render não fique inativo:
server.get('/ping', (req, res) => {
  res.sendStatus(200);
});

if (process.env.APP_PING !== undefined && process.env.APP_PING !== '') {
  cron.schedule('*/10 * * * *', () => {
    const http = require('http');
    const options = {
      hostname: process.env.APP_PING,
      path: '/ping',
      method: 'GET',
    };
  
    const req = http.request(options);
    req.on('error', (error) => {
      console.error("pingError:",error);
    });
  
    req.end();
  });
}
//

// Fazendo o server usar as rotas importadas: 
server.use("/emaj-api/auth", AuthRoute);
server.use("/emaj-api/email", EmailRoute);  
server.use("/emaj-api/users", UsersRoute);  
server.use("/emaj-api/activity", ActivityRoute);
server.use("/emaj-api/upload", UploadRoute);
server.use("/emaj-api/demands", DemandsRoute);
//

// Fazendo o server deixar público os diretórios onde fazemos o upload: 
server.use(
  "/user-files",
  express.static(path.resolve(__dirname, ".", "tmp", "uploads"))
);

server.use(
  "/client-files",
  express.static(path.resolve(__dirname, ".", "tmp", "uploads"))
);

server.use(
  "/demand-files",
  express.static(path.resolve(__dirname, ".", "tmp", "uploads"))
);
//

//{force:true}
db.sync().then(() => {
    server.listen(process.env.PORT)
    console.log(`Server running at: ${process.env.APP_URL}:${process.env.PORT}`);
}).catch(err => console.log(err))