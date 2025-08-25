const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
