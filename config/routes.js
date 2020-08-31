const router = require("../routes");

module.exports = (app) => {
  app.use("/", router.home);

  app.use("/users", router.users);

  app.use("/shoes", router.shoes);

  app.get("*", (req, res) => {
    res.render("404.hbs");
  });
};
