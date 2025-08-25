const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required."],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required."],
    },
    status: {
      type: String,
      enum: ["succeeded", "failed", "pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
