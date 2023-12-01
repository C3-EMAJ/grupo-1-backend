const router = require("express").Router();
const Client = require("../models/clients/Client.js")
const ClientSocioeconomicInformation = require("../models/clients/ClientSocioeconomicInformation.js")
const ClientAddress = require("../models/clients/ClientAddress.js")
const ClientContact = require("../models/clients/ClientContact.js")
const ClientDependents = require("../models/clients/ClientDependents.js")

function convertStringToDate(birthDateString) {
  const [day, month, year] = birthDateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

router.post("/add-client", async (req, res) => {
  try {
    
      let newClient = {
        name: req.body.name,
        rg: req.body.rg,
        cpf: req.body.cpf,
        birthday: convertStringToDate(req.body.birthDate),
        familiar: req.body.familiar
      };  
      
      const clientID = await Client.create(newClient);
      
      if (clientID) {
        let newClientAddress = {
          idClient: clientID.dataValues.id,
          cep: req.body.cep,
          street: req.body.street,
          number: req.body.number,
          complement: req.body.complement,
          representativeId: req.body.representative
        };
  
        let newClientContact = {
          idClient: clientID.dataValues.id,
          phone: req.body.firstCellphone,
          phoneTwo: req.body.secondCellphone,
          email: req.body.email,
        };
  
        const dependents = req.body.dependents;
        await ClientAddress.create(newClientAddress);
        await ClientContact.create(newClientContact);
        await ClientSocioeconomicInformation.create({familyIncome: req.body.familyIncome, idClient: clientID.dataValues.id})
        
        if (dependents && dependents.length > 0) {
          await Promise.all(
            dependents.map(async (dependent) => {
              await ClientDependents.create({
                name: dependent.name,
                age: dependent.age,
                idClient: clientID.dataValues.id,
              });
            })
          );
        }

        res.status(200).json({ message: "Client created successfully" });
      } else {
        res.status(500).json({message: "CPF ou RG Já Cadastrado"})
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/find-all", async (req, res) => {
    try {
        const clients = await Client.findAll({
            include: [
              {
                model: ClientSocioeconomicInformation,
                attributes: ['familyIncome'],
              },
              {
                model: ClientAddress,
                attributes: ['cep', 'street', 'number', 'complement'],
              },
              {
                model: ClientContact,
                attributes: ['phone', 'phoneTwo', 'email'],
              },
              {
                model: ClientDependents,
                attributes: ['name', 'age'],
              },
            ],
            order: [
              ['id', 'ASC'],
            ],
        });
    
        res.status(200);
    
      } catch (error) {
        res.status(500).json(error);
      }
})
  
module.exports = router;