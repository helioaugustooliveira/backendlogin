const app = require("./server.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Conectado ao MongoDB com sucesso.");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
    // Adicionado para garantir que o erro de conexão seja logado no arquivo
    const { logErrorToFile } = require("./middlewares/ApiError");
    logErrorToFile(err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
  });
