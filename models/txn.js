const mongoose = require('mongoose');

// Define the Txn item model Schema
const TxnSchema = new mongoose.Schema({
    userID: String,
    timestamp: Date,
    action: String,
    currency: String,
    base: String,
    quantity: Number,
    price: Number,
    created: Date
});

module.exports = mongoose.model('Txn', TxnSchema);