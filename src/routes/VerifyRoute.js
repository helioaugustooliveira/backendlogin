const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/VerifyController");

router.post("/verify", verifyController);

module.exports = router;
