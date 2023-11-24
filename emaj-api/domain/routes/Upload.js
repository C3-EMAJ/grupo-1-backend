const router = require("express").Router();
const multer = require("multer");

const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const UserImage = require('../models/user/UserImage')

const multerUser = require('../../infra/multer/userImages')

// Adicionar uma nova foto ao usuário:
router.post("/user-image", multer(multerUser).single("file"), async (req, res) => {
  try{
    const { originalname: name, size, key, location: url = "" } = req.file;
    
    const userImage = await UserImage.create({
      name,
      size,
      key,
      url,
      idUser: req.params.id,
    });
    
    res.status(200).json(userImage)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

// Deletando a foto de um usuário:
router.delete("/user-image/:id", async (req, res) => {
  try {
    let deleteUserImage = await UserImage.destroy({ where: { id: req.params.id } });
      if (deleteUserImage) {
          return res.status(200).json();
      }
    } catch (error) {
      res.status(500).json(error);
  }
});

// Editar a foto de um usuário:
router.put("/user-image", async (req, res) => {
  console.log(req.content)
  try{
    multer(multerUser).single("file")

    const { originalname: name, size, key, location: url = "" } = req.file;
    
    const userImage = await UserImage.update(
      {
        name,
        size,
        key,
        url,
        idUser: req.params.id,
      },
    
      {
        where: {id: req.content.id}
      }
    );
    
    res.status(200).json(userImage)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

module.exports = router;
