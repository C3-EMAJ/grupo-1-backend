const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { S3 } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const AWS_S3 = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },});

const storageTypes = {
  LOCAL_STORAGE: (folderPath) => multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads", `${folderPath}`));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${file.originalname}-${hash.toString("hex")}`;

        cb(null, file.key);
      });
    }
  }),
  
  AWS_S3_STORAGE: (folderPath) => multerS3({
    s3: AWS_S3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    //acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

          const fileName = `${folderPath}-${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  })
};

module.exports = storageTypes;