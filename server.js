// mern-backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // --- ADD THIS LINE ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(cors()); // --- ADD THIS LINE: Enable CORS for all routes ---
// For specific origins (recommended for production):
// app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your frontend URL in production

// --- MongoDB Connection (from Day 3) ---
const DB_URI = 'mongodb://localhost:27017/mern_items_db'; // <<<--- ENSURE THIS IS CORRECT!

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model (from Day 3) ---
const itemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  description: { type: String, required: false },
  date: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', itemSchema);

// --- Routes (from Day 3 - these are already fine, they handle JSON) ---

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item: ' + err.message });
  }
});

// POST a new item
app.post('/api/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description
  });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (Update) an existing item
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});