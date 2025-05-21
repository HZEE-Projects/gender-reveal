import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Guess } from './models/Guess.js';

dotenv.config();
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGOSH_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// POST /api/guesses
app.post('/api/guesses', async (req, res) => {
  try {
    const { name, guess, message } = req.body;
    if (!['male', 'female'].includes(guess)) {
      return res.status(400).json({ error: "Guess must be 'male' or 'female'" });
    }
    await Guess.create({ name, guess, message });
    
    
    const guesses = await Guess.find().sort({ createdAt: -1 });

    const male = guesses.filter(g => g.guess === 'male').length;
    const female = guesses.filter(g => g.guess === 'female').length;
    console.log({male, female})
    
    return res.json({
      male, female
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save guess' });
  }
});

// GET /api/guesses
app.get('/api/guesses', async (req, res) => {
  try {
    const guesses = await Guess.find().sort({ createdAt: -1 });

    const male = guesses.filter(g => g.guess === 'male').length;
    const female = guesses.filter(g => g.guess === 'female').length;
    console.log({male, female})
    return res.json({ male, female });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve guesses' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
