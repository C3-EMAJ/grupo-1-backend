const path = require("path");
const storageTypes = require("./multerConfig")

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads", "client-documents"),
  
  // Se vai ser local ou vai ser upado para o AWS S3:
  storage: storageTypes[process.env.STORAGE_TYPE]("client-documents/"),
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
      cb(new Error("Apenas arquivos PDF são permitidos."));
    }
}
};