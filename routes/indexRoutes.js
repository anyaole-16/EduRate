const express = require("express");
const router = express.Router();

// Landing page
router.get("/", (req, res) => {
  res.render("index"); // make sure index.ejs exists in views folder
});

module.exports = router;
