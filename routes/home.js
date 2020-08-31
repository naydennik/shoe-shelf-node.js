const router = require("express").Router();
const { home } = require("../controllers");
const auth = require("../utils/auth");

router.get("/", auth(false), home.get.home);

module.exports = router;
