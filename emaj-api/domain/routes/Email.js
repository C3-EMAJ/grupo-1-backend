const router = require("express").Router();
require('dotenv').config({path:'vars.env'});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: `${process.env.EMAIL_NAME}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
    tls: {
        rejectUnauthorized: false,
      },
  });

router.post('/send-code', async (req, res) => {
    const mailOptions = {
        from: `${process.env.EMAIL_NAME}`,
        to: req.body.email,
        subject: "EMAJ - Redefinição de Senha",
        html:`
        <body style="margin: 0; padding: 0;">
          <table class="outer table" style="border-spacing: 15px;" align="center" border="0" cellpadding="0" cellspacing="0" width="600" >
            <tr class="content">
              <td style="padding: 0px 15px; border: 0.5px solid #CECECE; border-radius: 5px;" bgcolor="#ffffff">
                <table border="0" width="100%">
                  <tr>
                    <td>
                      <p align="center" style="color: #000000; font-size: 20px; font-weight: bold;">Use o código abaixo para resetar a sua senha:</p>
                
                      <div style="width: 300px; border: none; border-radius: 5px; background-color: #FDAE17; color: white; font-size: 30px; font-weight: bold; text-align: center; margin: 0 auto;">
                        <div align="center" style="padding: 10px 0px 10px 0px;">${req.body.code}</div>
                      </div>

                      <br>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="footer">
              <td align="center" bgcolor="#000000" style="padding: 1px 0px; font-size: 1em; border-radius: 5px;">
                <p style="color: #ffffff;">&reg; EMAJ - Sistema, 2023</p>
              </td>
            </tr>
          </table>
        </body>`,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json();
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }

});

module.exports = router;