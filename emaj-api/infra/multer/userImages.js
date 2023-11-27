const path = require("path");
const fs = require('fs');
const { promisify } = require("util");

const crypto = require("crypto");
const { S3 } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer")
const UserImage = require("../../domain/models/user/UserImage");

const AWS_S3 = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
},});

const storageTypes = {
  LOCAL_STORAGE: (folderPath) => multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: async (req, file, cb) => {
      file.type = "LOCAL"

      const userImage = await UserImage.findOne({ where: { idUser: req.params.id } });
      if (userImage.url !== "https://i.imgur.com/oYEFKb1.png") {
        
        // Se a imagem antiga estiver na AWS, deleto ela:
        if (userImage.type === "AWS") {
          const resp = await AWS_S3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: userImage.key
          });
          console.log(resp)
        }
        //

        // Verificando se já existe um arquivo com esse nome anexado nessa pasta e removendo:
        const filePath = path.resolve(__dirname, "..", "..", "tmp", "uploads", userImage.key);

        if (fs.existsSync(filePath)) {
          // Excluir o arquivo
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Erro ao excluir o arquivo:', err);
            }
          });
        }
        
        file.key = userImage.key;
        cb(null, file.key);
      }

      else {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);
          
          file.key = `${folderPath}${hash.toString("hex")}-${file.originalname}`;
          console.log(file.key)
          cb(null, file.key);
        });
      }
    }
  }),
  
  AWS_S3_STORAGE: (folderPath) => multerS3({
    s3: AWS_S3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: "public-read",
    key: async (req, file, cb) => {
      file.type = "AWS"

      const userImage = await UserImage.findOne({ where: { idUser: req.params.id }})
      if (userImage.url != "https://i.imgur.com/oYEFKb1.png") {
        
        // Se a imagem antiga estiver localmente, deleto ela:
        if (userImage.type === "LOCAL") {
          promisify(fs.unlink)(  
            path.resolve(__dirname, "..", "..", "tmp", "uploads", userImage.key)
          );
        }
        //
      
        file.key = userImage.key
        cb(null, file.key)
      }
      else {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);
  
          const fileName = `${folderPath}${hash.toString("hex")}-${file.originalname}`;
  
          cb(null, fileName);
        });
      }
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  
  // Se vai ser local ou vai ser upado para o AWS S3:
  storage: storageTypes[process.env.STORAGE_TYPE]("user-images/"),
  //

  // Definindo o tamanho limite da imagem (5 mega):
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  //

  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/png",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens .png são aceitos."));
    }
  }
};