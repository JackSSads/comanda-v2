
const mongoose = require("mongoose");

const Check = mongoose.model("Check", {
    nameClient: String,
    obs: String,
    products: Array,
    totalValue: Number,
    status: Boolean,
    pagForm: String
});

module.exports = Check;