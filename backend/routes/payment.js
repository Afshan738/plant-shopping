const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const Payment = require("../model/payment");
const { protect } = require("../middleware/Authmiddleware");
const { getPaymentKey, verifyCallback } = require("../services/paymentService");

router.post("/initiate", protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to pay for this order" });
    }
    const amountInPKR = order.totalAmount;
    const paymentKey = await getPaymentKey(amountInPKR, orderId, userId);
    res.json({ paymentKey });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.post("/callback", async (req, res) => {
  try {
    const callbackData = req.body;

    const isAuthentic = verifyCallback(callbackData);
    if (!isAuthentic) {
      console.log("HMAC verification failed. Ignoring callback.");
      return res.status(400).json({ message: "Invalid callback signature" });
    }

    const isSuccess = callbackData.obj.success;
    const transactionId = callbackData.obj.id.toString();
    const orderIdFromPaymob = callbackData.obj.order.merchant_order_id;
    const order = await Order.findById(orderIdFromPaymob);
    if (!order) {
      console.log(
        `Callback received for an order not found in our DB: ${orderIdFromPaymob}`
      );
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentExists = await Payment.findOne({
      transactionId: transactionId,
    });
    if (paymentExists) {
      console.log(
        `Callback for transaction ${transactionId} has already been processed.`
      );
      return res.status(200).json({ message: "Callback already processed" });
    }

    if (isSuccess) {
      console.log(`Payment successful for Order ${order._id}`);

      await Payment.create({
        order: order._id,
        transactionId: transactionId,
        amount: order.totalAmount,
        status: "succeeded",
      });

      order.status = "processing";
      await order.save();
    } else {
      console.log(`Payment failed for Order ${order._id}`);

      order.status = "payment_failed";
      await order.save();
    }

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Error in Paymob callback handler:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
