const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  imageURL: {type: String, required: true},
  price: {type: Number, default: 1.00},
  inventory: {type: Number, default: 1},
  isInStock: {type: Boolean, default: true}
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
