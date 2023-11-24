const path = require("path");
const storageTypes = require("./multerConfig")

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads", "user-images"),
  
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
      "image/jpeg",
      "image/png",
      
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens .png e .jpeg são aceitos."));
    }
  }
};