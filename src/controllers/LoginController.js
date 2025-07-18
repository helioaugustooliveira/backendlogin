const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

const postLogin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email) {
      return res.status(400).json({ erro: "Email ou username é obrigatório" });
    }

    const query = email ? { email } : { username };
    const user = await Usuario.findOne(query);

    if (!user) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }
    if (!user.isValid) {
      return res
        .status(403)
        .json({ erro: "Conta não verificada. Verifique seu e-mail." });
    }

    // Previne ataques de enumeração de usuário e timing attacks
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordCorrect) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true, // ⚠️ Não acessível via JS no client (segurança)
      secure: process.env.NODE_ENV === "production", // só HTTPS em produção
      sameSite: "strict", // evita ataques CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    res.status(200).json({ message: "Login bem-sucedido" });
  } catch (err) {
    next(err);
  }
};

module.exports = postLogin;
