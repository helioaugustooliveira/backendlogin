const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

const postRegister = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await Usuario.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email && existingUser.username === username) {
        return res.status(400).json({ erro: "Email e usuário já existentes" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ erro: "Email já existente" });
      } else {
        return res.status(400).json({ erro: "Username já existente" });
      }
    }
    const user = new Usuario({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_VERIFYEMAIL,
      {
        expiresIn: "1h",
      },
    );

    const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    const success = await sendEmail(
      email,
      "Verificação de conta",
      `
  <h1>Verifique sua conta</h1>
  <p>Copie o token abaixo e envie para <code>POST /verify</code> no backend.</p>
  <pre>${token}</pre>
  <p>Exemplo usando <code>curl</code>:</p>
  <pre>
curl -X POST http://localhost:3000/verify \\
  -H "Content-Type: application/json" \\
  -d '{ "token": "${token.replace(/"/g, '\\"')}" }'
  </pre>
  `,
    );

    if (!success) {
      res.status(400).json({ erro: "Erro interno ao enviar email" });
    }

    return res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    // Trata o erro de chave duplicada do MongoDB (código 11000)
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.email) {
        return res.status(400).json({ erro: "Email já existente" });
      }
      if (err.keyPattern && err.keyPattern.username) {
        return res.status(400).json({ erro: "Username já existente" });
      }
      return res.status(400).json({ erro: "Usuário ou email já cadastrado" });
    }
    next(err);
  }
};

module.exports = postRegister;
