const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../model/user");
const connectDB = require("../db/db");
dotenv.config({ path: "../.env" });

const ADMIN_EMAIL = "qasimafshan89@gmail.com";
const ADMIN_PASSWORD = "herzamanbiy***ildim";
const ADMIN_NAME = "AdimAfshan";
connectDB();
const seedAdminUser = async () => {
  await connectDB();

  try {
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });

    if (adminExists) {
      console.log(
        "Admin user with this email already exists. No action taken."
      );
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("SUCCESS: Admin user has been created.");
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error("ERROR: Could not seed admin user.");
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  }
};
seedAdminUser();
