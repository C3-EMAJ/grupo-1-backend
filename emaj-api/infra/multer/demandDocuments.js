const path = require("path");
const fs = require('fs');
const { promisify } = require("util");

const crypto = require("crypto");
const { S3 } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer")

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

      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        
        file.key = `${folderPath}${hash.toString("hex")}.pdf`;
        cb(null, file.key);
      });
    }
  }),
  
  AWS_S3_STORAGE: (folderPath) => multerS3({
    s3: AWS_S3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: "public-read",
    key: async (req, file, cb) => {
      file.type = "AWS"

      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${folderPath}${hash.toString("hex")}.pdf`;

        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  
  // Se vai ser local ou vai ser upado para o AWS S3:
  storage: storageTypes[process.env.STORAGE_TYPE]("demand-documents/"),
  //

  // Definindo o tamanho limite do arquivo (15 mega)
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  //

  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/pdf"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos . PDF são permitidos."));
    }
}
};