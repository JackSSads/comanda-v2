const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
    nameProduct: String,
    value: Number,
    qnt: Number,
    totalPrice: Number,
    category: String,
    status: Boolean,
    obs: String
});

module.exports = Product;
