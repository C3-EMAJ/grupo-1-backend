const router = require("express").Router();

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user/User")
const UserImage = require("../models/user/UserImage");

router.post('/login', async (req, res) => {
    try{
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Campos 'email' e 'password' são obrigatórios." });
        }
  
        const user = await User.findOne({ where: { email: req.body.email }, 
            include: [{
                model: UserImage,
                attributes: ['url'],
            }],
        });

        if (!user) {
            return res.status(204).json({ error: "Credenciais incorretas. Verifique seu email e senha." });
        } 
        
        if (user.isActive == false) {
            return res.status(205).json({ error: "Usuário desativado!." });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECURITY_PASS);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(204).json({ error: "Credenciais incorretas. Verifique seu email e senha." });
        }
        
        const accessToken = jwt.sign(
        {
            id: user.id,
            isAdmin: user.isAdmin,
            typeUser: user.typeUser,
        },
            process.env.JWT_SECURITY_PASS,
            {expiresIn:"300d"}
        ); 

        const userJson = JSON.parse(JSON.stringify(user.dataValues));
        const { password, ...others } = userJson;
        
        res.status(200).json({ ...others, accessToken });
    
    } catch(error){
        console.log(error)
        res.status(500).json(error);
    }

});

// Mudar a senha de um usuário:
router.post("/modify-password", async (req, res) => {
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
          res.status(200).json("Password modified!");
        }
      } catch (err) {
        res.status(500).json(err);
      } 
});

// Checando se existe um usuário com um determinado email:
router.post("/check-email", async (req, res) => {
    try{
        const email = await User.findOne({ where: { email: req.body.email }  });
        if (email) {
            return res.status(200).json();
        }
        res.status(201).json();

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
       
});

module.exports = router;