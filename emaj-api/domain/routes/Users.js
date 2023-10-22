const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const CryptoJS = require("crypto-js");

const User = require('../models/User')

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

// Deletar um usuário :
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
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
  
        const { password, ...others } = user.toJSON();
        res.status(200).json(others);
  
      } catch (error) {
        res.status(500).json(error);
      }
})

// Pegar todos os usuários:
router.get("/find-all", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        const sanitizedUsers = users.map(user => {
          const { password, updatedAt, ...others } = user.toJSON();
          return others;
        });

        res.status(200).json(sanitizedUsers);
  
      } catch (error) {
        res.status(500).json(error);
      }
}) 

module.exports = router;