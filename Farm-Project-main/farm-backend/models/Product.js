const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  farmerName: {
    type: String,
    required: true,
    trim: true
  },

  productName: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    enum: ["Fruits", "Vegetables", "Grains", "Dairy"]
  },

  price: {
    type: Number,
    required: true,
    min: 1
  },

  quantity: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);