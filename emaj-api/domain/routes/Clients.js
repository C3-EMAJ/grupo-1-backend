const router = require("express").Router();
const Client = require("../models/clients/Client.js")
const ClientSocioeconomicInformation = require("../models/clients/ClientSocioeconomicInformation.js")
const ClientAddress = require("../models/clients/ClientAddress.js")
const ClientContact = require("../models/clients/ClientContact.js")
const ClientDependents = require("../models/clients/ClientDependents.js")

router.post("/add-client", async (req, res) => {
    try {
        let newClient = {
            name: req.body.name,
            rg: req.body.rg,
            cpf: req.body.cpf,
            birthday: req.body.birthDate,
        };  
  
        let newClientAddress = {
            cep: req.body.cep,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
        };
  
        let newClientContact = {
            phone: req.body.firstCellphone,
            phoneTwo: req.body.secondCellphone,
            email: req.body.email,
        };
  
        const dependents = req.body.dependents;

        await Client.create(newClient);

        await ClientAddress.create(newClientAddress);
        await ClientContact.create(newClientContact);
        await ClientSocioeconomicInformation.create({familyIncome: req.body.familyIncome})

        if (dependents && dependents.length > 0) {
        await Promise.all(
            dependents.map((dependent) =>
            ClientDependents.create({ ...dependent, ClientId: createdClient.id })
            )
        );
        }
    
        res.status(201).json({ message: "Client created successfully" });
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