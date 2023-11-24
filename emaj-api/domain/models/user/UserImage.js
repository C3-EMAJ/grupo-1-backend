const { DataTypes } = require('sequelize');

const db = require('../../../infra/database/db.js');

const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const UserImage = db.define('UserImage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    size: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    key: {
        type: DataTypes.STRING(500),
    },
    url: {
        type: DataTypes.STRING(500),
    },
},{
    timestamps: true,
});


UserImage.beforeCreate((user) => {
  if (!user.url) {
      user.url = `${process.env.APP_URL}/user-files/${user.key}`;
  }
});

UserImage.beforeDestroy(async (user) => {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", "user-images", this.key)
    );
  }
});

module.exports = UserImage;