import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(join(__dirname, 'intellicore.db'), (err) => {
  if (err) console.error('Database error:', err);
});

// Setup tables
db.serialize(() => {
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
  db.run(`INSERT OR IGNORE INTO users (email, password, name) VALUES ('alex.chen@intellicore.ai', 'password123', 'Alex Chen')`);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json({ id: row.id, email: row.email, name: row.name });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, email, name });
  });
});

app.get('/api/chats/:userId', (req, res) => {
  db.all('SELECT * FROM chats WHERE user_id = ? ORDER BY timestamp ASC', [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/chats', (req, res) => {
  const { userId, message, sender } = req.body;
  db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, sender], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Simulate AI response
    if (sender === 'user') {
      setTimeout(() => {
        const aiResponse = "Certainly! Here is a clean and efficient way to generate the Fibonacci sequence using iteration in Python. This approach is more memory-efficient than recursion for larger values of N.";
        db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [userId, aiResponse, 'ai'], function (err2) {
          if (err2) console.error(err2);
        });
      }, 1000);
      res.json({ success: true, id: this.lastID });
    } else {
      res.json({ success: true, id: this.lastID });
    }
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
