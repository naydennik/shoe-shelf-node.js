const models = require("../models");
const { validationResult } = require("express-validator");

module.exports = {
  get: {
    create: function (req, res) {
      res.render("shoe/create.hbs");
    },

    details: function (req, res) {
      const id = req.params.id;
      const email = req.cookies["email"];
      const userId = req.user._id;

      models.Shoe.findById({ _id: id }).then((shoe) => {
        const isAuthor = userId.toString() === shoe.creator.toString();
        const isBought = shoe.buyers.includes(email);

        res.render("shoe/details.hbs", {
          shoe: shoe.toJSON(),
          isAuthor,
          isBought,
        });
      });
    },

    edit: function (req, res) {
      const id = req.params.id;

      models.Shoe.findById({ _id: id }).then((shoe) => {
        res.render("shoe/edit.hbs", {
          shoe: shoe.toJSON(),
        });
      });
    },

    buy: function (req, res) {
      const id = req.params.id;
      const email = req.cookies["email"];
      const userId = req.user._id;

      Promise.all([
        models.Shoe.updateOne({ _id: id }, { $push: { buyers: email } }),
        models.User.updateOne({ _id: userId }, { $push: { offersBought: id } }),
      ])
        .then(([shoe, user]) => {
          res.redirect(`/shoes/details/${id}`);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  post: {
    create: function (req, res, next) {
      const { name, price, imageUrl, description, brand } = req.body;
      const authorId = req.user._id;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        result = Promise.reject({
          name: "ValidationError",
          errors: errors.errors,
        });
        return console.log(errors);
      }

      models.Shoe.create({
        name,
        price,
        imageUrl,
        description,
        brand,
        creator: authorId,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          if (err.name === "MongoError") {
            res.render("shoe/create.hbs", {
              name,
              price,
              imageUrl,
              description,
              brand,
            });
            console.log("Name already exists!");
            return;
          } else if (err.name === "ValidationError") {
            res.render("shoe/create.hbs", {
              name,
              price,
              imageUrl,
              description,
              brand,
              errors: Object.entries(err.errors).map((tuple) => {
                return console.log(tuple[1].message);
              }),
            });
            return;
          }
          next(err);
        });
    },

    edit: function (req, res, next) {
      const { name, price, imageUrl, description, brand } = req.body;
      const id = req.params.id;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        result = Promise.reject({
          name: "ValidationError",
          errors: errors.errors,
        });
        return console.log(errors);
      }

      models.Shoe.findByIdAndUpdate(
        { _id: id },
        { name, price, imageUrl, description, brand }
      )
        .then(() => {
          res.redirect(`/shoes/details/${id}`);
        })
        .catch((err) => {
          if (err.name === "MongoError") {
            res.render("course/create.hbs", {
              name,
              price,
              imageUrl,
              description,
              brand,
            });
            console.log("Title already exists!");
            return;
          } else if (err.name === "ValidationError") {
            res.render("course/create.hbs", {
              name,
              price,
              imageUrl,
              description,
              brand,
              errors: Object.entries(err.errors).map((tuple) => {
                return console.log(tuple[1].message);
              }),
            });
            return;
          }
          next(err);
        });
    },
  },
  delete: function (req, res) {
    const id = req.params.id;

    models.Shoe.findByIdAndRemove({ _id: id }).then(() => {
      res.redirect("/");
    });
  },
};
