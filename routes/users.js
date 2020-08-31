const router = require("express").Router();
const { user } = require("../controllers");

router.get("/login", user.get.login);
router.get("/register", user.get.register);
router.get("/logout", user.get.logout);

router.post("/login", user.post.login);
router.post("/register", user.post.register);

module.exports = router;
