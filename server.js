import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors()); // Simplified CORS for maximum compatibility
app.use(express.json());

// Initialize sql.js (pure JS/WASM - no native dependencies)
const DB_PATH = join(__dirname, 'intellicore.db');
let db;

async function initDB() {
  const SQL = await initSqlJs();
  
  // Load existing database file if it exists
  if (existsSync(DB_PATH)) {
    try {
      const fileBuffer = readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing database');
    } catch (e) {
      console.warn('Could not load existing DB, creating new one:', e.message);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Setup tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    sender TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Dummy user for testing
  try {
    db.run(`INSERT OR IGNORE INTO users (email, password, name) VALUES ('alex.chen@intellicore.ai', 'password123', 'Alex Chen')`);
  } catch (e) { /* ignore if exists */ }

  saveDB();
  console.log('Database initialized');
}

function saveDB() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  } catch (e) {
    console.warn('Could not save DB to disk:', e.message);
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'INTELLICORE API is running' });
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const result = db.exec('SELECT id, email, name FROM users WHERE email = ? AND password = ?', [email, password]);
    if (result.length > 0 && result[0].values.length > 0) {
      const [id, userEmail, name] = result[0].values[0];
      res.json({ id, email: userEmail, name });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    const result = db.exec('SELECT last_insert_rowid()');
    const id = result[0].values[0][0];
    saveDB();
    res.json({ id, email, name });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chats/:userId', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM chats WHERE user_id = ? ORDER BY timestamp ASC', [req.params.userId]);
    if (result.length === 0) return res.json([]);
    const columns = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => obj[col] = row[i]);
      return obj;
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats', (req, res) => {
  try {
    const { user_id, message, sender } = req.body;
    db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [user_id, message, sender]);
    const result = db.exec('SELECT last_insert_rowid()');
    const id = result[0].values[0][0];
    saveDB();

    // Simulate AI response
    if (sender === 'user') {
      setTimeout(() => {
        try {
          const aiResponse = "Certainly! Here is a clean and efficient way to generate the Fibonacci sequence using iteration in Python. This approach is more memory-efficient than recursion for larger values of N.";
          db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [user_id, aiResponse, 'ai']);
          saveDB();
        } catch (e) {
          console.error('AI response error:', e);
        }
      }, 1000);
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chats/:userId', (req, res) => {
  try {
    db.run('DELETE FROM chats WHERE user_id = ?', [req.params.userId]);
    saveDB();
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

// Initialize DB then start server
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
