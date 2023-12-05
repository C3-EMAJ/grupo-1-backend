const router = require("express").Router();
const { Sequelize } = require('sequelize');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const Demand = require("../models/demands/Demand");
const DemandDocument = require("../models/demands/DemandDocument");
const Client = require("../models/clients/Client");
const User = require("../models/user/User");

// Adicionar uma nova demanda:
router.post("/add-demand", async (req, res) => {
  try {

      if (req.body.number === "" || req.body.number === null) {
        var newDemand = {
          office: req.body.office,
          subject: req.body.subject,
          status: req.body.status,
          summary: req.body.summary,
          isActive: req.body.isActive
        };
      } else {

        var newDemand = {
          number: req.body.number,
          office: req.body.office,
          subject: req.body.subject,
          status: req.body.status,
          summary: req.body.summary,
          isActive: req.body.isActive
      };

      }

      await Demand.create(newDemand);

      res.status(200).json();
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        // O e-mail já existe:
        res.status(204).json({ error: 'Já foi criado uma demanda com esse número.' });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor.' });
      }
    }

});

// Deletar uma demanda:
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    let deletedDemand = await Demand.destroy({ where: { id: req.params.id } });

      if (deletedDemand) {
          return res.status(200).json();
      } else {
          res.status(500).json();
      }
    } catch (error) {
      res.status(500).json(error);
  }
})

// Desativar uma demanda:
router.put("/deactivate/:id", async (req, res) => {
  try {
    const demandDisabled = await Demand.update({isActive: false}, {
      where: {
        id: req.params.id
      }
    });
    if (demandDisabled) {
      res.status(200).json(demandDisabled);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})

// Ativar uma demanda:
router.put("/activate/:id",  async (req, res) => {
  try {
    const demandActivated = await Demand.update({isActive: true}, {
      where: {
        id: req.params.id
      }
    });
    if (demandActivated) {
      res.status(200).json(demandActivated);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})

// Achar uma demanda pelo id:
router.get("/find/:id", async (req, res) => {
  try {
    const demand = await Demand.findByPk(req.params.id, { 
      include: [
        {
            model: Client,
        },
        {
            model: User,
        },
        {
            model: DemandDocument,
        },
      ], } );

      res.status(200).json(demand);

    } catch (error) {
      res.status(500).json(error);
    }
})

// Pegar todas as demandas:
router.get("/find-all", async (req, res) => {
  try {
    const demands = await Demand.findAll({   
      include: [
        {
            model: Client,
        },
        {
            model: User,
        },
        {
            model: DemandDocument,
        },
      ],
      order: [
        ['id', 'ASC'],
      ],
    })

    res.status(200).json(demands);

  } catch (error) {
    res.status(500).json(error);
  }
})

// Atualizar uma demanda:
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Demand.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

// Adicionar um novo usuário a demanda:
router.post("/add-user", async (req, res) => {
  try {
    const user = await User.findByPk(req.body.idUser);
    const demand = await Demand.findByPk(req.body.idDemand);
    
    await demand.addUsers(user);

    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

// Removendo um novo usuário da demanda:
router.put("/remove-user", async (req, res) => {
  try {
    const user = await User.findByPk(req.body.idUser);
    const demand = await Demand.findByPk(req.body.idDemand);

    // Verificando se o usuário e a demanda existem
    if (!user || !demand) {
      return res.status(404).json({ error: "Usuário ou demanda não encontrados." });
    }
    //

    await demand.removeUsers(user);

    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});


// Adicionar um novo usuário a demanda:
router.post("/add-client", async (req, res) => {
  try {
    const client = await Client.findByPk(req.body.idClient);
    const demand = await Demand.findByPk(req.body.idDemand);
    
    await demand.addClients(client);

    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

// Adicionar um novo usuário a demanda:
router.put("/remove-client", async (req, res) => {
  try {
    const client = await Client.findByPk(req.body.idClient);
    const demand = await Demand.findByPk(req.body.idDemand);

    // Verificando se o usuário e a demanda existem
    if (!client || !demand) {
      return res.status(404).json({ error: "Usuário ou demanda não encontrados." });
    }
    //

    await demand.removeClients(client);

    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;