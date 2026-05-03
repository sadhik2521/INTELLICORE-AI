import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// API KEYS
const OPENAI_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyA3kMuKcnj_jyhJS0F54JroIT7QUrp4oHs";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize sql.js
const DB_PATH = join(__dirname, 'intellicore.db');
let db;

async function initDB() {
  const SQL = await initSqlJs();
  if (existsSync(DB_PATH)) {
    try {
      const fileBuffer = readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } catch (e) {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, name TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, message TEXT, sender TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  saveDB();
}

function saveDB() {
  try {
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  } catch (e) {}
}

// AI Response Logic
async function getAIResponse(model, userMessage) {
  try {
    if (model === 'gemini') {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await geminiModel.generateContent(userMessage);
      return result.response.text();
    } else {
      // Default to GPT-3.5 or GPT-4
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      });
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error('AI Error:', error);
    return "I'm sorry, I encountered an error connecting to the neural network. Please try again.";
  }
}

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const result = db.exec('SELECT id, email, name FROM users WHERE email = ? AND password = ?', [email, password]);
  if (result.length > 0 && result[0].values.length > 0) {
    const [id, userEmail, name] = result[0].values[0];
    res.json({ id, email: userEmail, name });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  try {
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    saveDB();
    const result = db.exec('SELECT last_insert_rowid()');
    res.json({ id: result[0].values[0][0], email, name });
  } catch (e) { res.status(400).json({ error: 'Email exists' }); }
});

app.get('/api/chats/:userId', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM chats WHERE user_id = ? ORDER BY timestamp ASC', [req.params.userId]);
    if (result.length === 0) return res.json([]);
    const columns = result[0].columns;
    res.json(result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => obj[col] = row[i]);
      return obj;
    }));
  } catch (e) { res.json([]); }
});

app.post('/api/chats', async (req, res) => {
  const { user_id, message, sender, model = 'gpt' } = req.body;
  db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [user_id, message, sender]);
  saveDB();

  if (sender === 'user') {
    const aiText = await getAIResponse(model, message);
    db.run('INSERT INTO chats (user_id, message, sender) VALUES (?, ?, ?)', [user_id, aiText, 'ai']);
    saveDB();
    res.json({ success: true, aiResponse: aiText });
  } else {
    res.json({ success: true });
  }
});

const PORT = process.env.PORT || 3001;
initDB().then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`)));
