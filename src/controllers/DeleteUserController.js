const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const DeleteUserController = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { emailToDelete } = req.body;

    if (!token) {
      return res.status(401).json({ erro: "Não autorizado" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Usuario.findOne({ _id: decode.id }); // Corrigido aqui

    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ erro: "Apenas administradores podem deletar usuários" });
    }

    const result = await Usuario.deleteOne({ email: emailToDelete });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ erro: "Usuário não encontrado para exclusão" });
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

module.exports = DeleteUserController;
