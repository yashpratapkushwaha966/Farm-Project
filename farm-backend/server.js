require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("FarmConnect backend is running");
});

// Add product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Product not added",
      error: error.message,
    });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Products not found",
      error: error.message,
    });
  }
});

// Place order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order failed",
      error: error.message,
    });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Orders not found",
      error: error.message,
    });
  }
});

// Demo OTP
let otpStore = {};

app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      message: "Phone number required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  console.log("OTP for", phone, "is", otp);

  res.json({
    message: "OTP sent successfully. Check backend terminal for demo OTP.",
  });
});

app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] === otp) {
    delete otpStore[phone];

    return res.json({
      message: "Login successful",
    });
  }

  res.status(400).json({
    message: "Invalid OTP",
  });
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

// Update product
app.put("/api/products/update/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        farmerName: req.body.farmerName,
        productName: req.body.productName,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        location: req.body.location,
        imageUrl: req.body.imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});