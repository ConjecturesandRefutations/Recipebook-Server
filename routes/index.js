const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Everything is working here");
});

module.exports = router;

