const HttpError = require("../Exceptions/HttpError");
const fs = require("fs/promises");
const path = require("path");

async function logErrorToFile(err) {
  const logDir = path.join(__dirname, "..", "..", "logs");
  const logFile = path.join(logDir, "error.log");
  const logMessage = `[${new Date().toISOString()}] ${err.stack || err.message}\n\n`;

  try {
    // cria a pasta logs se não existir
    await fs.mkdir(logDir, { recursive: true });

    // anexa a mensagem no arquivo error.log, cria o arquivo se não existir
    await fs.appendFile(logFile, logMessage);
  } catch (error) {
    console.error("Falha ao gravar no log de erros:", error);
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      erro: err.message,
      detalhes: err.errors || [],
    });
  }

  // Erro desconhecido: grava no log de forma assíncrona, mas não bloqueia resposta
  logErrorToFile(err);

  return res.status(500).json({
    erro: "Erro interno do servidor",
  });
}

module.exports = errorHandler;
