const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Small", "Medium", "Large"],
  },
  priceModifier: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plant name is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Base price is required."],
      min: 0,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sizes: [sizeSchema],
  },
  {
    timestamps: true,
  }
);

plantSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Plant", plantSchema);
