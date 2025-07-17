const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const blockObjectLikeString = require("../utils/blockObjectLikeString");
const registerController = require("../controllers/RegisterController");
const registerValidator = require("../middlewares/RegisterValidator");

router.post("/register", registerValidator, registerController);

module.exports = router;
