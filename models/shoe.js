const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    unique: [true, "Name already taken!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
    min: [0, "Price should be a possitive number!"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  brand: {
    type: String,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  buyers: {
    type: Array,
  },
});

module.exports = mongoose.model("Shoe", shoeSchema);
