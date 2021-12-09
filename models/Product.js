const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Product', ProductSchema);
