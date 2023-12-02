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
      attributes: ['id', 'name', 'rg', 'cpf', 'birthday', 'familiar', 'representativeId', 'isActive'],
      include: [
        {
          model: ClientContact,
          attributes: ['phone', 'phoneTwo', 'email'],
        },
      ],
      order: [
        ['id', 'ASC'],
      ],
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Desativar um assistido:
router.put("/deactivate/:id", async (req, res) => {
  try {
    const clientDisabled = await Client.update({isActive: false}, {
      where: {
        id: req.params.id
      }
    });
    if (clientDisabled) {
      res.status(200).json(clientDisabled);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})

// Ativar um assistido:
router.put("/activate/:id",  async (req, res) => {
  try {
    const clientActivated = await Client.update({isActive: true}, {
      where: {
        id: req.params.id
      }
    });
    if (clientActivated) {
      res.status(200).json(clientActivated);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})
  
module.exports = router;