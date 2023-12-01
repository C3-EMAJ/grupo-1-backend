const router = require("express").Router();
const { Sequelize } = require('sequelize');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const CryptoJS = require("crypto-js");

const Demand = require("../models/demands/Demand");
const DemandDocument = require("../models/demands/DemandDocument");
const Client = require("../models/clients/Cient");
const User = require("../models/user/User");

// Adicionar uma nova demanda:
router.post("/add-demand", async (req, res) => {
  try {
      let newDemand = {
          number: req.body.email,
          office: req.body.name,
          subject: req.body.email,
          status: req.body.email,
          summary: req.body.email,
      };

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
            attributes: ['url'],
        },
      ], } );

      res.status(200).json(demand);

    } catch (error) {
      res.status(500).json(error);
    }
})

// Pegar todos os usuários:
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
            attributes: ['url'],
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

// Atualizar um usuário:
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

module.exports = router;