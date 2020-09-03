const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const secret = "secret";

module.exports = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(secret));
  app.use(express.static(path.resolve(__basedir, "static")));
  app.engine(
    ".hbs",
    handlebars({
      extname: ".hbs",
      defaultLayout: "main",
    })
  );
  app.use((req, res, next) => {
    res.locals.isLogged = req.cookies["auth_cookie"] !== undefined;
    res.locals.email = req.cookies["email"];
    res.locals.name = req.cookies["name"];
    next();
  });
  app.set("views", path.resolve(__basedir, "views"));
};
