const express = require("express");
const router = express.Router();
const deleterUserController = require("../controllers/DeleteUserController");

router.delete("/deleteuser", deleterUserController);

module.exports = router;
