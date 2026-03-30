const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  category: { type: String, enum: ['men', 'women', 'unisex'], default: 'men' },
  image_url: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
