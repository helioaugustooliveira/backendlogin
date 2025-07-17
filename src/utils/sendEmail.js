const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

const userResend = new Resend(process.env.RESEND_KEY);

async function enviarEmail(userEmail, subject, html) {
  try {
    const data = await userResend.emails.send({
      from: "chatweb@primeiroano.com.br",
      to: [userEmail],
      subject: subject,
      html: html,
    });

    console.log("Email enviado:", data);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}

module.exports = enviarEmail;
