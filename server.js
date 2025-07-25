// mern-backend/server.js
require("dotenv").config(); // --- ADD THIS AT THE VERY TOP ---

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Use PORT from environment variables, fallback to 5000
const PORT = process.env.PORT || 5000;

// Use DB_URI from environment variables
const DB_URI = process.env.DB_URI; // --- CHANGE THIS LINE ---
if (!DB_URI) {
  console.error(
    "ERROR: DB_URI is not defined in .env or environment variables."
  );
  process.exit(1); // Exit if DB_URI is missing
}

app.use(express.json());
app.use(cors()); // Will be refined for production

mongoose
  .connect(DB_URI, {
    /* ... options ... */
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // process.exit(1); // Optional: Exit process on DB connection failure
  });

// ... (rest of your Mongoose Schema, Model, and Routes) ...

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI used: ${DB_URI.split("@")[0]}@...`); // Mask password for log
});
