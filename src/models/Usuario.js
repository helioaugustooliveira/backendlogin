const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
  isValid: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  resendCooldown: { type: Date, default: null },
});

// Hook (pre-save) para fazer o hash da senha antes de salvar
usuarioSchema.pre("save", async function (next) {
  // 'this' se refere ao documento do usuário que está sendo salvo
  if (!this.isModified("password")) {
    return next(); // Se a senha não foi modificada, não faz nada
  }

  try {
    const salt = await bcrypt.genSalt(10); // Gera um "salt" para o hash
    this.password = await bcrypt.hash(this.password, salt); // Faz o hash da senha
    next();
  } catch (error) {
    next(error); // Passa o erro para o próximo middleware
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema);
