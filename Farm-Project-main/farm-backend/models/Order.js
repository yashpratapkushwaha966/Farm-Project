const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);