const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Plant Nursery API is running..."));
app.use("/api/users", require("./routes/user"));
app.use("/api/categories", require("./routes/catagory"));
app.use("/api/plants", require("./routes/plant"));
app.use("/api/orders", require("./routes/order"));
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
);
