const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Street is required."],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required."],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required."],
    default: "Pakistan",
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
