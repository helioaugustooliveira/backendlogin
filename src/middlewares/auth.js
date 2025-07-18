const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ erro: "Não autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se o usuário do token ainda existe no banco de dados
    const user = await Usuario.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    req.user = decoded; // pode acessar req.user nos próximos middlewares
    next();
  } catch (err) {
    err;
    return res.status(403).json({ erro: "Token inválido" });
  }
};

module.exports = authMiddleware;
