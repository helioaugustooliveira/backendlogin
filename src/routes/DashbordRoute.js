const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
router.get("/", auth, (req, res) => {
  res.json({ message: "Hello" });
});

module.exports = router;
