const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

const postVerify = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_VERIFYEMAIL);

    const user = await Usuario.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (user.isValid) {
      return res.status(400).json({ erro: "Conta já verificada" });
    }

    user.isValid = true;
    await user.save();

    return res.json({ success: true, message: "Conta verificada com sucesso" });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ erro: "Token expirado" });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ erro: "Token inválido" });
    }
    next(err);
  }
};

module.exports = postVerify;
