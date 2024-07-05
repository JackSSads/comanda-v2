const mongoose = require("mongoose");

const Cashier = mongoose.model("Cashier", {
    createdAt: {
        type: Date,
        default: Date.now,
      },
    comandas: [],
    totalValue: Number,
    status: Boolean,
});

module.exports = Cashier;