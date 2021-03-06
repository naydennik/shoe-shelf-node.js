const models = require("../models");
const utils = require("../utils");
const appConfig = require("../app-config");
const { validationResult } = require("express-validator");

module.exports = {
  get: {
    login: function (req, res) {
      res.render("user/login.hbs");
    },
    register: function (req, res) {
      res.render("user/register.hbs");
    },
    profile: function (req, res) {
      const email = req.cookies["email"];

      models.User.findOne({ email })
        .populate("offersBought")
        .exec(function (err, user) {
          if (err) {
            console.log(err);
          }
          const sumPrices = user.offersBought.reduce(function (acc, curr) {
            return acc + curr.price;
          }, 0);
          res.render("user/profile.hbs", { sumPrices, user: user.toJSON() });
        });
    },
    logout: function (req, res) {
      const token = req.cookies[appConfig.authCookieName];
      models.tokenBlacklistModel.create({ token }).then(() => {
        res
          .clearCookie(appConfig.authCookieName)
          .clearCookie("email")
          .clearCookie("name")
          .redirect("/users/login");
      });
    },
  },
  post: {
    login: function (req, res, next) {
      const { email, password } = req.body;
      models.User.findOne({ email })
        .then((user) =>
          Promise.all([user, user ? user.matchPassword(password) : false])
        )
        .then(([user, match]) => {
          if (!match) {
            res.render("user/login.hbs", {
              email,
              password,
              errors: ["Wrong password or email!"],
            });
            return;
          }
          const token = utils.jwt.createToken({ id: user._id });

          res
            .cookie(appConfig.authCookieName, token)
            .cookie("email", user.email)
            .cookie("name", user.name)
            .redirect("/");
        });
    },
    register: function (req, res, next) {
      const { email, name, password, repeatPassword } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        result = Promise.reject({
          name: "ValidationError",
          errors: errors.errors,
        });
      }

      if (password !== repeatPassword) {
        res.render("user/register.hbs", {
          email,
          name,
          password,
          repeatPassword,
          errors: ["Password don't match the repeat password!"],
        });
        return;
      } else {
        models.User.create({ email, name, password })
          .then(() => {
            res.render("user/login.hbs", {
              success: "Successfully registered! Please Log In",
            });
          })
          .catch((err) => {
            if (err.name === "MongoError") {
              res.render("user/register.hbs", {
                email,
                name,
                password,
                repeatPassword,
                errors: ["User already exists!"],
              });
              return;
            } else if (err.name === "ValidationError") {
              res.render("user/register.hbs", {
                email,
                name,
                password,
                repeatPassword,
                errors: Object.entries(err.errors).map((tuple) => {
                  return tuple[1].message;
                }),
              });
              return;
            }
            next(err);
          });
      }
    },
  },
};
