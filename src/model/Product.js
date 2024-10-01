const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;