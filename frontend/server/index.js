const express = require('express');
const cors = require('cors');
const { Database } = require('@vlcn.io/crsqlite-wasm');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize database
async function initDB() {
  db = await Database.load();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS guesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      guess TEXT NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Initialize the database
initDB().catch(console.error);

// Get all guesses stats
app.get('/api/guesses', async (req, res) => {
  try {
    const stats = await db.execO(`
      SELECT guess, COUNT(*) as count
      FROM guesses
      GROUP BY guess
    `);

    const formattedStats = {
      boy: 0,
      girl: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.guess] = stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Add new guess
app.post('/api/guesses', async (req, res) => {
  const { name, guess, message } = req.body;

  try {
    await db.exec(`
      INSERT INTO guesses (name, guess, message)
      VALUES (?, ?, ?)
    `, [name, guess, message]);

    const stats = await db.execO(`
      SELECT guess, COUNT(*) as count
      FROM guesses
      GROUP BY guess
    `);

    const formattedStats = {
      boy: 0,
      girl: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.guess] = stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error saving guess:', error);
    res.status(500).json({ error: 'Failed to save guess' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});