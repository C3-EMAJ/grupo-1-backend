const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const CryptoJS = require("crypto-js");

const User = require('../models/user/User')
const UserActivity = require('../models/user/UserActivity')

// Adicionar um novo usuário:
router.post("/add", async (req, res) => {
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

      res.status(201).json();
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
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

// Achar um usuário pelo id:
router.get("/find/:id", async (req, res) => {
  console.log(req.params.id)
  
  try {
    const user = await User.findByPk(req.params.id, { 
      include: [
        {
          model: UserActivity,
          attributes: ['action', 'createdAt'],
        },
      ], } );

      const { password, ...others } = user.toJSON();
      res.status(200).json(others);

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
      ]
    })

    const sanitizedUsers = users.map(user => {
      const { password, updatedAt, ...others } = user.toJSON();
      return others;
    });

    res.status(200).json(sanitizedUsers);

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: errorMessage });
  }
})

// Atualizar um usuário:
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    const updatedProduct = await Product.findByPk(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;