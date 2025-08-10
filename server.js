const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();
const PORT = 3000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// Session
app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false
}));

// Routes
app.use("/", authRoutes);
app.use("/api", formRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
