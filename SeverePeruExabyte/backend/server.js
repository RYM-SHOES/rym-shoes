require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL DEFAULT 'unisex',
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    const existing = await client.query('SELECT id FROM admin_users WHERE username = $1', ['admin']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 12);
      await client.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
    }
    await client.query('COMMIT');
    console.log('Database ready');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration error:', err.message);
  } finally {
    client.release();
  }
}

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.replit\.dev$/,
    /\.repl\.co$/,
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rym SHOES API running on port ${PORT}`);
  runMigrations();
});
