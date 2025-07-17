const { body } = require("express-validator");
const blockObjectLikeString = require("../utils/blockObjectLikeString"); // se tiver

const registerValidator = [
  body("username")
    .trim()
    .escape() // remove <, >, &, ', " etc.
    .custom(blockObjectLikeString)
    .isLength({ min: 3 })
    .withMessage("Username inválido"),

  body("email").isEmail().withMessage("Email inválido"),

  body("password")
    .trim()
    .escape()
    .custom(blockObjectLikeString)
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
];

module.exports = registerValidator;
