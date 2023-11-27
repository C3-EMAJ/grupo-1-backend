const router = require("express").Router();
const { Sequelize } = require('sequelize');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const CryptoJS = require("crypto-js");

const User = require('../models/user/User')
const UserActivity = require('../models/user/UserActivity');
const UserImage = require("../models/user/UserImage");

// Adicionar um novo usuário:
router.post("/add-user", async (req, res) => {
  try {
      let newUser = {
          name: req.body.name,
          email: req.body.email,
          
          password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.CRYPTO_SECURITY_PASS
          ).toString(),
          
          type: req.body.type,  
          isAdmin: req.body.isAdmin
      };

      await User.create(newUser);

      res.status(200).json();
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        // O e-mail já existe:
        res.status(204).json({ error: 'E-mail já está em uso.' });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor.' });
      }
    }

});

// Deletar um usuário:
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    let deletedUser = await User.destroy({ where: { id: req.params.id } });

      if (deletedUser) {
          return res.status(200).json();
      }
    } catch (error) {
      res.status(500).json(error);
  }
})

// Desativar um usuário:
router.put("/deactivate/:id", async (req, res) => {
  try {
    const userDisabled = await User.update({isActive: false}, {
      where: {
        id: req.params.id
      }
    });
    if (userDisabled) {
      res.status(200).json(userDisabled);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})

// Ativar um usuário:
router.put("/activate/:id",  async (req, res) => {
  try {
    const userActivated = await User.update({isActive: true}, {
      where: {
        id: req.params.id
      }
    });
    if (userActivated) {
      res.status(200).json(userActivated);
    }
    else {
      res.status(201).json("Something went wrong!");
    }

  } catch (err) {
    res.status(500).json(err);
  }
})

// Achar um usuário pelo id:
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { 
      include: [
        {
          model: UserActivity,
          attributes: ['action', 'createdAt'],
        },
        {
          model: UserImage,
          attributes: ['url'],
        },
      ], } );
      
      const { password, ...others } = user.toJSON();
      res.status(200).json(others);

    } catch (error) {
      res.status(500).json(error);
    }
})

// Pegar um usuário que foi recém atualizado incluindo um TokenJWT (para mudar o usuário logado):
router.get("/find-updated/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { 
      include: [
        {
          model: UserActivity,
          attributes: ['action', 'createdAt'],
        },
        {
          model: UserImage,
          attributes: ['url'],
        },
      ], 
    });

    const accessToken = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
      typeUser: user.typeUser,
    },
      process.env.JWT_SECURITY_PASS,
      {expiresIn:"5d"}
    ); 

    const userJson = JSON.parse(JSON.stringify(user.dataValues));
    const { password, ...others } = userJson;
    res.status(200).json({ ...others, accessToken });
      
    } catch (error) {
      res.status(500).json(error);
    }
})

// Pegar todos os usuários:
router.get("/find-all", async (req, res) => {
  try {
    const users = await User.findAll({   
      include: [
        {
          model: UserActivity,
          attributes: ['action', 'createdAt'],
        },
        {
          model: UserImage,
          attributes: ['url'],
        },
      ],
      order: [
        ['id', 'ASC'],
      ],
    })

    const sanitizedUsers = users.map(user => {
      const { password, updatedAt, ...others } = user.toJSON();
      return others;
    });

    res.status(200).json(sanitizedUsers);

  } catch (error) {
    res.status(500).json(error);
  }
})

// Atualizar um usuário:
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.update(req.body, {
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