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

// --- Mongoose Schema & Model (from Day 3) ---
const itemSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String, required: false },
  date: { type: Date, default: Date.now },
});
const Item = mongoose.model("Item", itemSchema);

// --- Routes (from Day 3 - these are already fine, they handle JSON) ---

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single item by ID
app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching item: " + err.message });
  }
});

// POST a new item
app.post("/api/items", async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description,
  });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (Update) an existing item
app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting item: " + err.message });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI used: ${DB_URI.split("@")[0]}@...`); // Mask password for log
});
