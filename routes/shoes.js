const router = require("express").Router();
const { shoe } = require("../controllers");
const auth = require("../utils/auth");

router.get("/create", auth(), shoe.get.create);
router.get("/details/:id", auth(), shoe.get.details);
router.get("/edit/:id", auth(), shoe.get.edit);
router.get("/delete/:id", auth(), shoe.delete);
router.get("/buy/:id", auth(), shoe.get.buy);

router.post("/create", auth(), shoe.post.create);
router.post("/edit/:id", auth(), shoe.post.edit);

module.exports = router;
