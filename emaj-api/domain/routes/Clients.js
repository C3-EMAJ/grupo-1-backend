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
      await ClientSocioeconomicInformation.create({familyIncome: req.body.familyIncome, profession: req.body.profession, acquaintance: req.body.acquaintance, idClient: clientID.dataValues.id})
      
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
          model: ClientContact,
        },
        {
          model: ClientAddress,
        },
        {
          model: ClientDependents,
        },
        {
          model: ClientSocioeconomicInformation,
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
  
// Deletar um assistido:
router.delete("/delete/:id", async (req, res) => {
  try {
    let deletedClient = await Client.destroy({ where: { id: req.params.id } });
      if (deletedClient) {
          return res.status(200).json();
      }
    } catch (error) {
      res.status(500).json(error);
  }
})

// Achar dado de um assistido pelo ID
router.get("/find/:id", async (req, res) => {
  try {
    const clients = await Client.findByPk(req.params.id, {
      attributes: ['id', 'name', 'rg', 'cpf', 'birthday', 'representativeId', 'isActive'],
      include: [
        {
          model: ClientContact,
          attributes: ['phone', 'phoneTwo', 'email'],
        },
        {
          model: ClientAddress,
          attributes: ['cep', 'street', 'number', "complement"],
        },
        {
          model: ClientDependents,
          attributes: ["id", 'name', 'age'],
        },
        {
          model: ClientSocioeconomicInformation,
          attributes: ["familyIncome", "acquaintance", "profession"],
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
})

router.put("/update/:id/:updateType", async (req, res) => {
  try {
    const updateType = req.params.updateType;
    console.log(req.params.id, req.params.updateType, req.body);
    if (updateType === "address") {
      const [rowsUpdated, [updatedClientAddress]] = await ClientAddress.update(
        req.body.address,
        {
          where: {
            idClient: req.params.id
          },
          returning: true, // This returns the updated record
        }
      );
      if (rowsUpdated > 0) {
        res.status(200).json(updatedClientAddress);
      } else {
        res.status(500).json({ message: "Failed to update client address" });
      }
    } if (updateType === "information") {
      const updatedInformations = []
      const contacts = {
        phone: req.body.information.phone,
        phoneTwo: req.body.information.phoneTwo,
        email: req.body.information.email
      };
      const [rowsUpdatedContact, [updatedClientContact]] = await ClientContact.update(
        contacts,
        {
          where: {
            idClient: req.params.id
          },
          returning: true,
        }
      );
      if (rowsUpdatedContact > 0) {
        updatedInformations.push(updatedClientContact);
      } else {
        res.status(500).json({ message: "Failed to update client contact" });
      }
      const clientInformation = {
        name: req.body.information.name,
        cpf: req.body.information.cpf,
        rg: req.body.information.rg,
        birthday: convertStringToDate(req.body.information.birthday),
        representativeId: req.body.information.representativeId
      };
      const [rowsUpdatedClientInformation, [updatedClient]] = await Client.update(
        clientInformation,
        {
          where: {
            id: req.params.id
          },
          returning: true,
        }
      );
      if (rowsUpdatedClientInformation > 0) {
        updatedInformations.push(updatedClient);
      } else {
        res.status(500).json({ message: "Failed to update client contact" });
      }
      const clientSocioEconomicInformation = {
        familyIncome: req.body.information.familyIncome,
        acquaintance: req.body.information.acquaintance,
        profession: req.body.information.profession,
      };
      const [rowsUpdatedClientSocioEconomicInformation, [updatedClientSocioEconomicInformation]] = await ClientSocioeconomicInformation.update(
        clientSocioEconomicInformation,
        {
          where: {
            idClient: req.params.id
          },
          returning: true,
        }
      );
      if (rowsUpdatedClientSocioEconomicInformation > 0) {
        updatedInformations.push(updatedClientSocioEconomicInformation);
      } else {
        res.status(500).json({ message: "Failed to update client contact" });
      }
      const dependents = req.body.information.dependents;
      let deletedClientDependents = await ClientDependents.destroy({ where: { idClient: req.params.id } });
      if (dependents && dependents.length > 0) {
        await Promise.all(
          dependents.map(async (dependent) => {
            await ClientDependents.create({
              name: dependent.name,
              age: dependent.age,
              idClient: req.params.id,
            });
          })
        );
      }
      if (updatedInformations.length > 0) {
        res.status(200).json(updatedInformations);
      }
    } 
    else {
      res.status(400).json({ message: "Invalid update type" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;