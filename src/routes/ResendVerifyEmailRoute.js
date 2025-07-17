const express = require("express");
const router = express.Router();
const resendController = require("../controllers/ResendController");

router.post("/resendemail", resendController);

module.exports = router;
