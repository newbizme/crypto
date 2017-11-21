const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const ExchangeKeySchema = new mongoose.Schema({
    userID: String,
    password: String,
    exchange: String,
    apikey: String,
    apisecret: String,
    created: Date
});

var secret = process.env.ENCRYPTION_SECRET;
ExchangeKeySchema.plugin(encrypt, { secret: secret, encryptedFields: ['password','apisecret'] });


module.exports = mongoose.model('ExchangeKey', ExchangeKeySchema);