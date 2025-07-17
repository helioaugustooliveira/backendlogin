function blockObjectLikeString(valor) {
  if (typeof valor !== "string") throw new Error("Deve ser uma string");
  const limpo = valor.trim();

  // Bloqueia valores como "[object Object]" ou strings que começam com { ou [
  if (limpo === "[object Object]") throw new Error("Formato inválido");
  if (/^{.*}$/.test(limpo)) throw new Error("Valor não pode parecer um objeto");
  if (/['"]?\{[^}]*\}['"]?/.test(limpo))
    throw new Error("Valor contém estrutura suspeita");

  return true;
}

module.exports = blockObjectLikeString;
