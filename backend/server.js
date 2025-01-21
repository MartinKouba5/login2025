const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Import knihovny fs

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pro parsování JSON
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kontrola a vytvoření složky uploads, pokud neexistuje
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads folder created at:', uploadsDir);
}
// Připojení k databázi
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: 'root',
  password: '',
  database: 'kouba2025'
});

// Pomocná funkce pro spuštění dotazů
const runQuery = async (query, params = []) => {
  const [rows] = await pool.query(query, params);
  return rows;
};

////////////// USERS ///////////

// Registrace uživatele
app.post('/users', async (req, res) => {
  const { name, email, password, is_admin } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email již existuje' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, is_admin || false]
    );

    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    console.error('Chyba při registraci:', error);
    res.status(500).json({ message: 'Interní chyba serveru' });
  }
});

// Přihlášení uživatele
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Uživatel nenalezen' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Špatné heslo' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    });
  } catch (error) {
    console.error('Chyba při přihlášení:', error);
    res.status(500).json({ message: 'Interní chyba serveru' });
  }
});

// Výpis všech uživatelů
app.get('/users', async (req, res) => {
  try {
    const users = await runQuery('SELECT id, name, email, is_admin, created_at FROM users');
    res.json(users);
  } catch (error) {
    console.error('Chyba při získávání uživatelů:', error);
    res.status(500).json({ message: 'Interní chyba serveru' });
  }
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin === 1, // Convert `1` to `true` for admin.
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

