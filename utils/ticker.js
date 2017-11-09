const ccxt = require('ccxt');

async function fetchTickersAll() {
    let exchange = new ccxt['bittrex']();
    exchange.apiKey = process.env.BITTREX_APIKEY;
    exchange.secret = process.env.BITTREX_APISECRET;
    
    let tickers = await (exchange.fetchTickers ())
    return tickers;
}

module.exports = fetchTickersAll;