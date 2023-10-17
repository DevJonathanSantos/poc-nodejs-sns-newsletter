"use strict";

const nodemailer = require("nodemailer");

const { formatMessageEmail } = require("../utils/formatMessageEmail");
const emails = require("../utils/users.json");

module.exports.handler = async (event) => {
  try {
    console.log("Inicip");

    if (event.Records && event.Records.length) {
      // verifica se tem records dentro do evento
      const data = JSON.parse(event.Records[0].Sns.Message); // pega os dados que enviamos na publicação do TOPICO no arquivo *publish-newsletter.js*

      const transporter = nodemailer.createTransport({
        // configuração do envio do email
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const message = formatMessageEmail(data); // formata a mensagem do email

      await transporter.sendMail({
        from: '"Receitinhas" <jojo.rtd1@gmail.com>', // de qual email está sendo enviado
        to: emails.data, // emails que cadastramos em utils/users.json
        subject: data.subject, // titulo do email que passamos ao publicar o TOPICO
        html: message, // a mensagem que será entregue no corpo do email
      });

      console.log("SEND_EMAIL");

      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
