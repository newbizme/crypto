const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ExchangeKeySchema = new mongoose.Schema({
    userID: String,
    password: String,
    exchange: String,
    apikey: String,
    apisecret: String,
    created: Date
});




module.exports = mongoose.model('ExchangeKey', ExchangeKeySchema);