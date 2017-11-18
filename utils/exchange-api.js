const axios = require('axios');
const ccxt = require('ccxt');

// current unified API rollout: https://user-images.githubusercontent.com/1294454/32442381-4a63e734-c30c-11e7-9cd5-559fd623672b.png 
// Be sure to check exchange API for specific requirements to include in the params object

// ++++++++++++++++++++++++++++++++
// +++++++    RETURN TRADES
// ++++++++++++++++++++++++++++++++

const hasFetchTradesUnifiedAPI = ['poloniex', 'kraken', 'binance', 'cryptopia', 'dsx', 'liqui', 'tidex', 'wex', 'yobit'];

async function fetchTrades(name, apikey, apisecret, password) {
    let exchange = new ccxt[name]();
    exchange.apiKey = apikey;
    exchange.secret = apisecret;
    exchange.password = password;

    let trades;
    let depsWiths;
    let tradeHistory;

    let accounts;

    if (hasFetchTradesUnifiedAPI.includes(name)) {
        // Poloniex - exchange API
        // depsWiths = await exchange.privatePostReturnDepositsWithdrawals({start: 1493596800, end: 1510701542 });
        // tradeHistory = await exchange.privatePostReturnTradeHistory({currencyPair: 'all', start: 1493596800, end: 1510701542});
        // Poloniex - unified API
        console.log('exchange: poloniex');

        try {
            trades = await exchange.fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {currencyPair: 'all', start: 1493596800, end: 1510701542});
            // add key 'exchange' with exchange name
            trades.map(t => t.exchange = name);
            return trades;
        } catch (err) {
            console.error(err);
            return err;
        }
        

    } else if (name === 'gdax') {
        // accounts = await exchange.privateGetAccounts();
        let accHistory = [];
        // GDAX doc: https://docs.gdax.com/#get-account-history 
        // The route includes the accountIds.. 

    }

}


// ++++++++++++++++++++++++++++++++
// +++++++    TEST KEY VALIDITY
// ++++++++++++++++++++++++++++++++

async function testConnection(name, apikey, apisecret, password) {
    let exchange = new ccxt[name]();
    exchange.apiKey = apikey;
    exchange.secret = apisecret;
    if (password) {
        exchange.password = password
    }
    
    let status = false;

    await exchange.fetchBalance()
        .then((res) => {
            status = true;
        })
        .catch((error) => {
            console.log(error);
            status = false;
        })

        
    return status;
}

module.exports = {
    fetchTrades,
    testConnection
};