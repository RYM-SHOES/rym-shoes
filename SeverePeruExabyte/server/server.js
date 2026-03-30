require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    /\.replit\.dev$/,
    /\.vercel\.app$/,
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

async function seedAdmin() {
  const User = require('./models/User');
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 12);
    await User.create({ username: 'admin', password_hash: hash, role: 'admin' });
    console.log('Default admin created: admin / admin123');
  }
}

async function seedProducts() {
  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Oxford Brogue — Black', price: 395, description: 'Hand-crafted full-grain leather oxford.', category: 'men' },
      { name: 'Chelsea Boot — Cognac', price: 445, description: 'Italian suede chelsea boot.', category: 'men' },
      { name: 'Loafer — Tobacco', price: 325, description: 'Penny loafer in smooth calf leather.', category: 'men' },
      { name: 'Derby Shoe — Tan', price: 360, description: 'Open-laced derby in vegetable-tanned leather.', category: 'men' },
    ]);
    console.log('Seed products inserted');
  }
}

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rymshoes')
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
    await seedProducts();
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Rym SHOES API running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server running on port ${PORT} (DB offline)`)
    );
  });
