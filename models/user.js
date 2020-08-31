const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already taken!"],
    validate: {
      validator: function (v) {
        return /[a-zA-Z0-9@\.]{3,}/.test(v);
      },
      message:
        "Email should be at least 3 characters long and should contain only English letters and digits!",
    },
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    validate: {
      validator: function (v) {
        return /[a-zA-Z0-9]{3,}/.test(v);
      },
      message:
        "Password should be at least 3 characters long and should contain only English letters and digits!",
    },
  },
  offersBought: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shoe",
    },
  ],
});

userSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        next(err);
        return;
      }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
          return;
        }
        this.password = hash;
        next();
      });
    });
    return;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
