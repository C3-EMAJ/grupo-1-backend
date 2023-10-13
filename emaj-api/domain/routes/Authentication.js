const router = require("express").Router();

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/User")

router.post('/login', async (req, res) => {
    try{
        console.log(req.body)
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Campos 'email' e 'password' são obrigatórios." });
        }
  
        const user = await User.findOne({ where: { email: req.body.email }  });
        if (!user) {
            return res.status(204).json({ error: "Credenciais incorretas. Verifique seu email e senha." });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECURITY_PASS);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(204).json({ error: "Credenciais incorretas. Verifique seu email e senha." });
        }

        const accessToken = jwt.sign(
        {
            id: user.id,
            typeUser: user.typeUser,
        },
            process.env.JWT_SECURITY_PASS,
            {expiresIn:"3d"}
        );

        const userJson = JSON.parse(JSON.stringify(user.dataValues));
        const { password, ...others } = userJson;

        res.status(200).json({ ...others, accessToken });
    
    } catch(error){
        res.status(500).json(error);
    }

});

router.post("/reset-password", async (req, res) => {
    try {
        if(req.body.password) {
            var encryptedPassword = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.CRYPTO_SECURITY_PASS
            ).toString();
        }

        let updatedUser = await User.update(
            { password: encryptedPassword },
            { where: { email: req.body.email } }
          );

        if (updatedUser) {
          res.status(200).json("Password reseted!");
        }
      } catch (err) {
        res.status(500).json(err);
      } 
    });

module.exports = router;