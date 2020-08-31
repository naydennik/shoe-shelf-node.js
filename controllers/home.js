const config = require("../config/config");
const models = require("../models");

module.exports = {
  get: {
    home: function (req, res) {
      models.Shoe.find().then((shoes) => {
        shoes.sort((a, b) => {
          return b.buyers.length - a.buyers.length;
        });

        res.render("index.hbs", {
          shoes: shoes.map((p) => p.toJSON()),
        });
      });
    },
  },
};
