const sendEmail = require("../utils/sendEmail");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

postResend = async (req, res) => {
  const { email } = req.body;
  const user = await Usuario.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ erro: "Usuário não existe" });
  }

  if (user.isValid) {
    return res.status(400).json({ erro: "Usuário já foi verificado" });
  }
  if (user.resendCooldown && user.resendCooldown > new Date()) {
    const minutosRestantes = Math.ceil(
      (user.resendCooldown - new Date()) / 1000 / 60
    );
    return res.status(429).json({
      erro: `Aguarde ${minutosRestantes} minuto(s) para reenviar o e-mail.`,
    });
  }

  // Gera novo token e envia e-mail
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_VERIFYEMAIL, {
    expiresIn: "1h",
  });

  const success = await sendEmail(email, "Verificação", `...`);

  if (success) {
    user.resendCooldown = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos de cooldown
    await user.save();
    return res.status(200).json("E-mail re-enviado com sucesso");
  }

  return res.status(500).json({ erro: "Erro interno no servidor" });
};

module.exports = postResend;
