const router = require("express").Router();
const multer = require("multer");

const { S3 } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const AWS_S3 = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
},});

const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../../infra/security/tokenJWT");

const UserImage = require('../models/user/UserImage')
const multerUser = require('../../infra/multer/userImages')

const DemandDocument = require('../models/demands/DemandDocument')
const multerDemand = require('../../infra/multer/demandDocuments')

// Adicionar uma nova foto ao usuário:
router.put("/user-image/:id", multer(multerUser).single("file"), async (req, res) => {
  try{
    var { originalname: name, size, key, type, location: url = "" } = req.file;

    if (process.env.STORAGE_TYPE == "LOCAL_STORAGE" && !req.file.url) {
      url = `${process.env.APP_URL}/user-files/${key}`;
    }

    const userImage = await UserImage.update({
      name,
      size,
      key,
      url,
      type,
    },{
    where: {
      idUser: req.params.id
    },});
    
    res.status(200).json(userImage)
  } catch (error) {
    res.status(500).json(error)
  }
});

// Deletando a foto de um usuário:
router.delete("/user-image/:id", async (req, res) => {
  try {

    let userImage = await UserImage.findOne({where: {idUser: req.params.id}})
    
    if (userImage.type == "AWS") {
      const resp = await 

                    AWS_S3.deleteObject(
                      {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: userImage.key
                      })

      console.log(resp)
    } 
    
    else if (userImage.type == "LOCAL") {
        promisify(fs.unlink)(  
          path.resolve(__dirname, "..", "..", "tmp", "uploads", userImage.key)
        );
    }

    const updatedImage = await UserImage.update({ name: null, size: null, key: null,
      url:"https://i.imgur.com/oYEFKb1.png",
      type:null
    },{
      where: {
        idUser: req.params.id
      },}
    );

    if (updatedImage) {
      res.status(200).json(updatedImage)
    }

  } catch (error) {
    res.status(500).json(error)
  }
});


// Adicionar um novo documento a uma demanda:
router.post("/demand-document/:id", multer(multerDemand).single("file"), async (req, res) => {
  try{
    var { originalname: name, size, key, type, location: url = "" } = req.file;

    if (process.env.STORAGE_TYPE == "LOCAL_STORAGE" && !req.file.url) {
      url = `${process.env.APP_URL}/demand-files/${key}`;
    }

    const demandDocument = await DemandDocument.create({
      name,
      size,
      key,
      url,
      type,
      idDemand: req.params.id
    });
    
    res.status(200).json(demandDocument)
  } catch (error) {
    res.status(500).json(error)
  }
});

// Deletando um documento de uma demanda:
router.put("/demand-document", async (req, res) => {
  try {

    let deletedDocument = await DemandDocument.destroy({ where: { id: req.body.id } });
    if (deletedDocument) {
        
      if (req.body.type == "AWS") {
        const resp = await 
          AWS_S3.deleteObject(
            {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: req.body.key
            })
      } 

      else if (req.body.type == "LOCAL") {
        promisify(fs.unlink)(  
          path.resolve(__dirname, "..", "..", "tmp", "uploads", req.body.key)
        );
      }

      res.status(200).json("Ok.")

    }

  } catch (error) {
    res.status(500).json(error)
  }
});

module.exports = router;
