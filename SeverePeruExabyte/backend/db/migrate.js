require('dotenv').config({ path: '../.env' });
const pool = require('./index');
const bcrypt = require('bcryptjs');

async function migrate() {
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

    const existing = await client.query(
      'SELECT id FROM admin_users WHERE username = $1',
      ['admin']
    );

    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 12);
      await client.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['admin', hash]
      );
      console.log('Default admin created: admin / admin123');
    }

    const productCount = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCount.rows[0].count) === 0) {
      const seeds = [
        ['Oxford Brogue — Black', 395.00, 'Hand-crafted full-grain leather oxford with antique brass eyelets. A cornerstone of the gentleman\'s wardrobe.', 'men', null],
        ['Chelsea Boot — Cognac', 445.00, 'Italian suede chelsea boot with elasticated side panels. Effortlessly transitions from day to evening.', 'men', null],
        ['Loafer — Tobacco', 325.00, 'Penny loafer in smooth calf leather. The epitome of understated luxury.', 'men', null],
        ['Mary Jane Heel — Ivory', 375.00, 'Block-heeled mary jane in soft ivory leather. Refined femininity for the modern woman.', 'women', null],
        ['Ballet Flat — Nude', 285.00, 'Buttery suede ballet flat with a square toe. Parisian elegance, effortlessly worn.', 'women', null],
        ['Ankle Boot — Olive', 495.00, 'Structured ankle boot in smooth leather. A sculptural heel meets old-money restraint.', 'women', null],
        ['Derby Shoe — Tan', 360.00, 'Open-laced derby in vegetable-tanned leather. Ages beautifully with every wear.', 'men', null],
        ['Mule — Cream', 295.00, 'Backless leather mule with a low stacked heel. The summer staple of the discerning wardrobe.', 'women', null],
      ];

      for (const [name, price, description, category, image_url] of seeds) {
        await client.query(
          'INSERT INTO products (name, price, description, category, image_url) VALUES ($1, $2, $3, $4, $5)',
          [name, price, description, category, image_url]
        );
      }
      console.log('Seed products inserted');
    }

    await client.query('COMMIT');
    console.log('Migration complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

migrate().then(() => process.exit(0)).catch(() => process.exit(1));
