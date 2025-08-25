const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const { protect } = require("../middleware/Authmiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, deliveryAddress, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      deliveryAddress,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to view this order" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
